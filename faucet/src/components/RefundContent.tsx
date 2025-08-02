import { REFUND_ADDRESS } from '../constants';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useEffect, useState, useCallback } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
// import { Transaction } from '@mysten/sui/transactions';

const RefundContent = () => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  

  const [refundBalance, setRefundBalance] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  // const [loading, setLoading] = useState(false);
  // const [txnDigest, setTxnDigest] = useState('');
  const [userCoins, setUserCoins] = useState<any[]>([]);

  // const { mutate: signTransaction } = useSignTransaction();

  const getBalance = useCallback(
    async (walletAddress: string) => {
      if (!walletAddress || !suiClient) {
        setRefundBalance('');
        console.log(refundBalance)
        setUserCoins([]);
        console.log(userCoins)
        console.warn('Cannot fetch balance: Wallet address or SuiClient not available.');
        return;
      }

      try {
        const coinsResponse = await suiClient.getCoins({
          owner: walletAddress,
          coinType: '0x2::sui::SUI',
        });

        setUserCoins(coinsResponse.data);

        const totalSUIBalance = coinsResponse.data.reduce(
          (acc, coin) => acc + BigInt(coin.balance),
          BigInt(0)
        );
        setRefundBalance((Number(totalSUIBalance) / 1e9).toString());
      } catch (err) {
        console.error('Error fetching balance:', err);
        setRefundBalance('');
        setUserCoins([]);
      }
    },
    [suiClient]
  );

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(REFUND_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  /*
  const handleRefund = async () => {
    if (!currentAccount || !suiClient) {
      setSendResult({
        success: false,
        error: 'Wallet not connected or SuiClient not initialized',
      });
      setLoading(false);
      return;
    }

    if (userCoins.length === 0) {
      setSendResult({
        success: false,
        error: 'No SUI coins found to refund',
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setSendResult(null);

    try {
      // Calculate total balance in MIST
      const totalBalance = userCoins.reduce((acc, coin) => acc + BigInt(coin.balance), BigInt(0));

      // Set gas budget (in MIST)
      const gasBudget = BigInt(3_976_000); // Match the provided gas budget
      if (totalBalance < gasBudget) {
        throw new Error('Insufficient balance to cover gas fees');
      }

      // Amount to transfer (total balance minus gas budget)
      const amountToTransfer = totalBalance - gasBudget;

      // Find a coin with sufficient balance for both gas and transfer
      const totalNeeded = amountToTransfer + gasBudget;
      const coinToUse = userCoins.find(coin => BigInt(coin.balance) >= totalNeeded);

      if (!coinToUse) {
        throw new Error('No coin with sufficient balance for refund');
      }

      const tx = new Transaction();
      tx.setSender(currentAccount.address);

      // Set gas payment
      tx.setGasPayment([{
        objectId: coinToUse.coinObjectId,
        version: coinToUse.version,
        digest: coinToUse.digest,
      }]);

      // Split and transfer the remaining balance
      const [coinToTransfer] = tx.splitCoins(tx.gas, [amountToTransfer]);
      tx.transferObjects([coinToTransfer], REFUND_ADDRESS);

      signTransaction(
        //@ts-ignore
        { transaction: tx, account: currentAccount },
        {
          onSuccess: async signedTx => {
            console.log('Transaction signed:', signedTx);
            try {
              console.log('Executing signed transaction...');
              const txnRes = await suiClient.executeTransactionBlock({
                signature: signedTx.signature,
                transactionBlock: signedTx.bytes,
                options: {
                  showEffects: true,
                  showEvents: true,
                },
              });
              console.log('Transaction Execution Response:', txnRes);

              if (txnRes?.digest && txnRes.effects?.status.status === 'success') {
                setSendResult({
                  success: true,
                  message: `Successfully refunded ${formatBalance((Number(amountToTransfer) / 1e9).toString())} SUI`,
                });
                setTxnDigest(txnRes.digest);
                console.log(`Refund Success. Digest: ${txnRes.digest}`);
                getBalance(currentAccount.address);
                setTimeout(() => {
                  setSendResult(null);
                }, 5000);
              } else {
                console.error('Transaction failed or had non-success status:', txnRes);
                setSendResult({
                  success: false,
                  error: 'Transaction failed. Check console for details.',
                });
              }
            } catch (execError) {
              console.error('Error executing signed transaction:', execError);
              setSendResult({
                success: false,
                error: 'Error executing transaction. Check console for details.',
              });
            } finally {
              setLoading(false);
            }
          },
          onError: err => {
            console.error('Error signing transaction:', err);
            setSendResult({
              success: false,
              error: 'Error signing transaction. Check console for details.',
            });
            setLoading(false);
          },
        }
      );
    } catch (error) {
      console.error('Refund error:', error);
      setSendResult({
        success: false,
        error: error instanceof Error ? error.message : 'Refund failed',
      });
      setLoading(false);
    }
  };
  */

  useEffect(() => {
    if (currentAccount?.address && suiClient) {
      getBalance(currentAccount.address);
    } else {
      setRefundBalance('');
      setUserCoins([]);
    }
  }, [currentAccount?.address, suiClient, getBalance]);

  /*const formatBalance = (balance: string) => {
    if (!balance) return '0';
    const balanceNum = parseFloat(balance);
    return balanceNum.toFixed(4);
  };*/

  return (
    <div className="flex flex-col space-y-6 items-center text-center w-80 sm:w-96">
      <div className="text-lg font-bold text-[#4DA2FF]">
        Unused Testnet SUI?
      </div>
      <div className="text-sm text-white opacity-80">
        Return your unused tokens to help other developers!
      </div>
      <div className="text-xs text-white opacity-60">
        Return tokens to address:
      </div>
      <button
        onClick={handleCopyAddress}
        className="w-full px-4 py-3 bg-[#011829] border-2 border-[#2e3b4e] rounded-lg hover:border-[#4DA2FF] transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#4DA2FF] break-all text-left">
            {REFUND_ADDRESS}
          </div>
          <div className="ml-2 text-[#4DA2FF] opacity-70 group-hover:opacity-100 transition-opacity duration-200">
            {copied ? <FaCheck className="w-4 h-4" /> : <FaCopy className="w-4 h-4" />}
          </div>
        </div>
      </button>
      {copied && (
        <div className="text-xs text-[#4DA2FF] opacity-80">
          Address copied to clipboard!
        </div>
      )}
      
      {/* 
      {currentAccount && refundBalance && (
        <div className="w-full space-y-4">
          <div className="text-sm text-white opacity-80">
            Your balance: {formatBalance(refundBalance)} SUI
          </div>
          <button
            onClick={handleRefund}
            disabled={loading || !currentAccount || !suiClient || userCoins.length === 0}
            className="w-full py-3 px-6 bg-[#4DA2FF] text-[#030F1C] border-2 border-[#4DA2FF] rounded-sm font-['Space_Mono'] text-sm font-bold tracking-[0.5px] cursor-pointer transition-all duration-200 hover:bg-[#030F1C] hover:text-[#4DA2FF] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'REFUNDING...' : 'REFUND ALL SUI'}
          </button>
          {txnDigest && (
            <div className="text-xs text-[#4DA2FF] opacity-80">
              Transaction: {txnDigest.substring(0, 20)}...
              <a
                href={`https://suiscan.xyz/testnet/tx/${txnDigest}`}
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
      */}
    </div>
  );
};

export default RefundContent;