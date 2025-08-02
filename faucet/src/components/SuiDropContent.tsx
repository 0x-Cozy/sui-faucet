import RainSlider from './RainSlider';
import { HCAPTCHA_SITEKEY } from '../constants';
import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { useEffect, useState, useRef } from 'react';
import { isValidSuiAddress } from '@mysten/sui/utils';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { apiService } from '../services/api';

interface SuiDropContentProps {
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  sliderValue: number;
  setSliderValue: (value: number) => void;
  captchaCompleted: boolean;
  handleCaptchaClick: () => void;
  onCaptchaSolved?: () => void;
}

const SuiDropContent = ({ 
  walletAddress, 
  setWalletAddress, 
  sliderValue, 
  setSliderValue, 
  captchaCompleted, 
  handleCaptchaClick,
  onCaptchaSolved
}: SuiDropContentProps) => {
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();
  const [balance, setBalance] = useState<string>('');
  const [isValidAddress, setIsValidAddress] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [resolvedAddress, setResolvedAddress] = useState<string>('');
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [requestResult, setRequestResult] = useState<{ success: boolean; message?: string; error?: string; txHash?: string } | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentAccount) {
      setWalletAddress(currentAccount.address);
    }
  }, [currentAccount, setWalletAddress]);

  useEffect(() => {
    return () => {
      setWalletAddress('');
      setBalance('');
      setIsValidAddress(false);
      setCaptchaToken('');
      setResolvedAddress('');
      setIsResolving(false);
    };
  }, [setWalletAddress, setSliderValue]);

  // clear result after 50 seconds
  useEffect(() => {
    if (requestResult) {
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
      }
      
      resultTimeoutRef.current = setTimeout(() => {
        setRequestResult(null);
      }, 50000);
    }

    return () => {
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
      }
    };
  }, [requestResult]);

  useEffect(() => {
    const validateAddress = async () => {
      if (walletAddress.trim()) {
        const input = walletAddress.trim();
        const isValid = isValidSuiAddress(input);
        
        if (isValid) {
          // direct wallet address
          setIsValidAddress(true);
          setResolvedAddress(input);
          fetchBalance(input);
        } else {
          // try to resolve SNS name
          setIsResolving(true);
          try {
            const snsClient = new SuiClient({ url: getFullnodeUrl("mainnet") });
            const resolved = await snsClient.resolveNameServiceAddress({
              name: input
            });
            
            if (resolved) {
              setIsValidAddress(true);
              setResolvedAddress(resolved);
              fetchBalance(resolved);
            } else {
              setIsValidAddress(false);
              setResolvedAddress('');
              setBalance('');
            }
          } catch (error) {
            console.error('Error resolving SNS name:', error);
            setIsValidAddress(false);
            setResolvedAddress('');
            setBalance('');
          } finally {
            setIsResolving(false);
          }
        }
      } else {
        setIsValidAddress(false);
        setResolvedAddress('');
        setBalance('');
      }
    };

    validateAddress();
  }, [walletAddress, suiClient]);

  const fetchBalance = async (address: string) => {
    try {
      const balance = await suiClient.getBalance({
        owner: address,
        coinType: '0x2::sui::SUI'
      });
      setBalance(balance.totalBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('');
    }
  };

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    handleCaptchaClick();
    onCaptchaSolved?.();
  };

  const handleCaptchaExpire = () => {
    setCaptchaToken('');
  };

  const handleCaptchaError = (err: string) => {
    console.error('hCaptcha error:', err);
    setCaptchaToken('');
  };

  const handleRequestFaucet = async () => {
    if (!isValidAddress || !captchaToken || isRequesting) {
      return;
    }

    setIsRequesting(true);
    setRequestResult(null);

    try {
      const targetAddress = resolvedAddress || walletAddress.trim();
      const amount = (sliderValue / 100) * 0.9 + 0.1;

      const response = await apiService.requestFaucet({
        walletAddress: targetAddress,
        amount: amount,
        captchaToken: captchaToken
      });

      if (response.success) {
        setRequestResult({
          success: true,
          message: response.message || 'SUI tokens sent successfully!',
          txHash: response.txHash
        });
        // reset captcha
        if (captchaRef.current) {
          captchaRef.current.resetCaptcha();
        }
        setCaptchaToken('');
        handleCaptchaClick();
      } else {
        setRequestResult({
          success: false,
          error: response.error || 'Request failed'
        });
      }
    } catch (error) {
      console.error('Faucet request failed:', error);
      setRequestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const formatBalance = (balance: string) => {
    if (!balance) return '0';
    const balanceNum = parseInt(balance) / 1000000000;
    return balanceNum.toFixed(4);
  };

  const formatTxHash = (txHash: string) => {
    return `${txHash.slice(0, 8)}...${txHash.slice(-8)}`;
  };

  return (
    <div className="flex flex-col space-y-4 items-center w-80 sm:w-96">
      <div className="w-full mb-6">
        <label className="block text-xs text-[#4DA2FF] opacity-80 mb-2">
          WALLET ADDRESS
        </label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className={`w-full px-4 py-3 bg-[#030F1C] border-2 rounded-sm text-white text-sm focus:outline-none focus:shadow-[0_0_10px_rgba(111,188,240,0.3)] transition-all duration-300 ${
            walletAddress.trim() 
              ? isValidAddress 
                ? 'border-[#4DA2FF]' 
                : 'border-red-400 opacity-70' 
              : 'border-[#4DA2FF] focus:border-[#6fbcf0]'
          }`}
          placeholder="Enter wallet address or SNS name"
        />
        {walletAddress.trim() && (
          <div className="mt-2 flex justify-between items-center">
            <div className={`text-xs ${isValidAddress ? 'text-[#4DA2FF]' : 'text-red-400 opacity-70'}`}>
              {isResolving ? '🔄 Resolving...' : isValidAddress ? '✓ Valid address' : '✗ Invalid address'}
            </div>
            {isValidAddress && balance && (
              <div className="text-xs text-white opacity-70">
                Balance: {formatBalance(balance)} SUI
              </div>
            )}
          </div>
        )}
        {resolvedAddress && resolvedAddress !== walletAddress.trim() && (
          <div className="mt-1 text-xs text-[#4DA2FF] opacity-60">
            Resolved: {resolvedAddress.slice(0, 6)}...{resolvedAddress.slice(-4)}
          </div>
        )}
      </div>
      
      <RainSlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
      
      <div className="w-full space-y-4">
        <div className="flex justify-center">
          <HCaptcha
            ref={captchaRef}
            sitekey={HCAPTCHA_SITEKEY}
            onVerify={handleCaptchaVerify}
            onExpire={handleCaptchaExpire}
            onError={handleCaptchaError}
            theme="dark"
          />
        </div>
        
        {captchaCompleted && isValidAddress && captchaToken && (
          <div className="w-full flex justify-center">
            <button 
              onClick={handleRequestFaucet}
              disabled={isRequesting}
              className="w-full py-3 px-8 rounded-sm font-['Space_Mono'] text-sm font-bold tracking-[0.5px] items-center justify-center transition-all duration-300 cursor-pointer bg-[#4DA2FF]/70 text-[#030F1C] hover:border-2 border-[#4DA2FF] hover:bg-[#030F1C] hover:text-[#4DA2FF] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRequesting ? 'SENDING...' : 'REQUEST SUI DROP'}
            </button>
          </div>
        )}

        {requestResult && (
          <div className={`w-full p-3 rounded-sm text-xs font-['Space_Mono'] text-center space-y-2 animate-fadeIn ${
            requestResult.success 
              ? 'bg-green-500/20 border border-green-500 text-green-400' 
              : 'bg-red-500/20 border border-red-500 text-red-400'
          }`}>
            <div>{requestResult.success ? requestResult.message : requestResult.error}</div>
            {requestResult.success && requestResult.txHash && (
              <div className="text-xs opacity-80">
                TX: {formatTxHash(requestResult.txHash)}
                <a
                  href={`https://suiscan.xyz/testnet/tx/${requestResult.txHash}`}
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
    </div>
  );
};

export default SuiDropContent; 