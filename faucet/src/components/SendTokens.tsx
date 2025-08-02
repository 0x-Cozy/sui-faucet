import { useState, useEffect, useCallback } from 'react';
import { useCurrentAccount, useSuiClient, useWallets, useSignTransaction } from '@mysten/dapp-kit';
import { FaSpinner } from 'react-icons/fa';
import { IoSend } from "react-icons/io5";
import { isValidSuiAddress } from '@mysten/sui/utils';
import { isEnokiWallet } from '@mysten/enoki';
import { Transaction } from '@mysten/sui/transactions';

interface SendTokensProps {
  onClose?: () => void;
  isCompact?: boolean;
}

const SendTokens = ({ onClose, isCompact = false }: SendTokensProps) => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const wallets = useWallets();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [balance, setBalance] = useState<string>('');
  const [userCoins, setUserCoins] = useState<any[]>([]);
  const [sendResult, setSendResult] = useState<{ success: boolean; message?: string; error?: string; txHash?: string } | null>(null);

  const { mutate: signTransaction } = useSignTransaction();

  const isGoogleWallet = currentAccount && wallets.some(wallet => 
    isEnokiWallet(wallet) && wallet.accounts.some(account => account.address === currentAccount.address)
  );

  const fetchBalance = useCallback(async () => {
    if (!currentAccount || !suiClient) {
      setBalance('');
      setUserCoins([]);
      return;
    }
    
    try {
      const coinsResponse = await suiClient.getCoins({
        owner: currentAccount.address,
        coinType: '0x2::sui::SUI',
      });

      setUserCoins(coinsResponse.data);

      const totalSUIBalance = coinsResponse.data.reduce(
        (acc, coin) => acc + BigInt(coin.balance),
        BigInt(0)
      );
      setBalance((Number(totalSUIBalance) / 1e9).toString());
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('');
      setUserCoins([]);
    }
  }, [currentAccount, suiClient]);

  // Get balance when component mounts
  useEffect(() => {
    if (currentAccount) {
      fetchBalance();
    }
  }, [currentAccount, fetchBalance]);

  const validateAddress = (address: string) => {
    const isValid = isValidSuiAddress(address.trim());
    setIsValidAddress(isValid);
    return isValid;
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setRecipientAddress(address);
    if (address.trim()) {
      validateAddress(address);
    } else {
      setIsValidAddress(false);
    }
  };

  const handleSendTokens = async () => {
    if (!currentAccount || !suiClient || !isValidAddress || isSending) {
      return;
    }

    if (userCoins.length === 0) {
      setSendResult({
        success: false,
        error: 'No SUI coins found to send'
      });
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const amountInMist = BigInt(Math.floor(parseFloat(balance) * 1_000_000_000));
      const gasBudget = BigInt(4000000); 
      
      const findCoin = (coinList: any[], min: bigint) =>
        coinList.find((c) => BigInt(c.balance) >= min);

      const totalNeeded = amountInMist + gasBudget;
      const transferCoin = findCoin(userCoins, totalNeeded);
      
      if (!transferCoin) {
        throw new Error('Insufficient balance for transfer and gas');
      }

      const tx = new Transaction();
      tx.setSender(currentAccount.address);

      tx.setGasPayment([{
        objectId: transferCoin.coinObjectId,
        version: transferCoin.version,
        digest: transferCoin.digest,
      }]);

      // Split from the gas coin (which is the same as transfer coin)
      const [coinToTransfer] = tx.splitCoins(tx.gas, [amountInMist]);
      tx.transferObjects([coinToTransfer], recipientAddress.trim());

      signTransaction(
        //@ts-ignore
        { transaction: tx, account: currentAccount },
        {
          onSuccess: async signedTx => {
            console.log("tx signed:", signedTx);
            try {
              console.log("Executing signed transaction...");
              const txnRes = await suiClient.executeTransactionBlock({
                signature: signedTx.signature,
                transactionBlock: signedTx.bytes,
                options: {
                  showEffects: true,
                  showEvents: true,
                },
              });
              console.log("Transaction Execution Response:", txnRes);

              if (txnRes?.digest && txnRes.effects?.status.status === "success") {
                setSendResult({
                  success: true,
                  message: `Successfully sent ${formatBalance(balance)} SUI`,
                  txHash: txnRes.digest
                });
                console.log(`Transfer Success. Digest: ${txnRes.digest}`);
                fetchBalance();
                
                setTimeout(() => {
                  setRecipientAddress('');
                  setIsValidAddress(false);
                  setSendResult(null);
                  onClose?.();
                }, 5000);
              } else {
                console.error("Transaction failed or had non-success status:", txnRes);
                setSendResult({
                  success: false,
                  error: "Transaction failed. Check console for details."
                });
              }
            } catch (execError) {
              console.error("Error executing signed transaction:", execError);
              setSendResult({
                success: false,
                error: "Error executing transaction. Check console for details."
              });
            } finally {
              setIsSending(false);
            }
          },
          onError: err => {
            console.error("Error signing transaction:", err);
            setSendResult({
              success: false,
              error: "Error signing transaction. Check console for details."
            });
            setIsSending(false);
          },
        }
      );

    } catch (error) {
      console.error('Send tokens failed:', error);
      setSendResult({
        success: false,
        error: error instanceof Error ? error.message : 'Send failed'
      });
      setIsSending(false);
    }
  };


  const formatBalance = (balance: string) => {
    if (!balance) return '0';
    const balanceNum = parseFloat(balance);
    return balanceNum.toFixed(4);
  };

  const formatTxHash = (txHash: string) => {
    return `${txHash.slice(0, 8)}...${txHash.slice(-8)}`;
  };

  // only show for google wallets
  if (!currentAccount || !isGoogleWallet) return null;

  return (
    <div className={`${isCompact ? 'space-y-2' : 'space-y-3'}`}>
      <div className={`${isCompact ? 'text-xs' : 'text-sm'} text-white opacity-70`}>
        Send your wallet balance
      </div>
      
      <div className="space-y-2">
        <div className="flex gap-1">
          <input
            type="text"
            value={recipientAddress}
            onChange={handleAddressChange}
            placeholder="Recipient address"
            className={`flex-1 px-3 py-2 bg-[#011829] border rounded-sm text-white text-xs focus:outline-none focus:shadow-[0_0_10px_rgba(111,188,240,0.1)] transition-all duration-300 ${
              recipientAddress.trim() 
                ? isValidAddress 
                  ? 'border-[#4DA2FF]' 
                  : 'border-red-400 opacity-70' 
                : 'border-[#2e3b4e] focus:border-[#4DA2FF]'
            }`}
          />
          <button
            onClick={handleSendTokens}
            disabled={!isValidAddress || isSending || !balance || parseFloat(balance) === 0}
            className="flex-shrink-0 w-9 h-9 bg-[#4DA2FF] text-[#030F1C] border border-[#4DA2FF] rounded-sm flex items-center justify-center transition-all duration-200 hover:bg-[#030F1C] hover:text-[#4DA2FF] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <FaSpinner className="w-3 h-3 animate-spin" />
            ) : (
              <IoSend className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {recipientAddress.trim() && (
          <div className={`text-xs ${isValidAddress ? 'text-[#4DA2FF]' : 'text-red-400 opacity-70'}`}>
            {isValidAddress ? '✓ Valid address' : '✗ Invalid address'}
          </div>
        )}
      </div>

      {balance && (
        <div className={`text-xs text-white opacity-70`}>
          Balance: {formatBalance(balance)} SUI
        </div>
      )}

      {sendResult && (
        <div className={`text-xs font-['Space_Mono'] text-center p-2 rounded-sm ${
          sendResult.success 
            ? 'bg-green-500/20 border border-green-500 text-green-400' 
            : 'bg-red-500/20 border border-red-500 text-red-400'
        }`}>
          <div>{sendResult.success ? sendResult.message : sendResult.error}</div>
          {sendResult.success && sendResult.txHash && (
            <div className="text-xs opacity-80 mt-1">
              TX: {formatTxHash(sendResult.txHash)}
              <a
                href={`https://suiscan.xyz/testnet/tx/${sendResult.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 underline hover:no-underline"
              >
                View
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SendTokens; 