import {
  useConnectWallet,
  useCurrentAccount,
  useWallets,
  ConnectModal,
} from "@mysten/dapp-kit";
import { useState, useEffect } from 'react';
import {
  isEnokiWallet,
  type EnokiWallet,
  type AuthProvider,
} from "@mysten/enoki";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaWallet, FaChevronLeft } from 'react-icons/fa';

export default function Login() {
  const currentAccount = useCurrentAccount();
  const [open, setOpen] = useState(false);
  const { mutate: connect } = useConnectWallet();
  const navigate = useNavigate();

  const wallets = useWallets().filter(isEnokiWallet);
  const walletsByProvider = wallets.reduce(
    (map, wallet) => map.set(wallet.provider, wallet),
    new Map<AuthProvider, EnokiWallet>()
  );

  const googleWallet = walletsByProvider.get("google");

  useEffect(() => {
    if (currentAccount) {
      navigate("/");
    }
  }, [currentAccount, navigate]);

  if (currentAccount) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#030F1C] text-white font-['Orbitron'] flex items-center justify-center px-4">
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center justify-center w-10 h-10 bg-[#030F1C] border-2 border-[#4DA2FF] rounded-full text-[#4DA2FF] hover:text-white hover:bg-[#4DA2FF] transition-all duration-200 shadow-[0_0_3px_rgba(111,188,240,0.6)]"
      >
        <FaChevronLeft className="w-4 h-4" />
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-[#4DA2FF] uppercase tracking-[2px] md:tracking-[3px] font-['Space_Mono'] mb-4">
            FIRST MOVERS
          </h1>
          <p className="text-white opacity-70 font-['Space_Mono'] text-sm md:text-base tracking-[0.5px]">
            Connect your wallet to access the faucet
          </p>
        </div>

        <div className="bg-[#050F1E] border-2 border-[#4DA2FF] rounded-sm p-6 md:p-8 shadow-[0_0_3px_rgba(111,188,240,0.6)]">
          <div className="space-y-4">
            <ConnectModal
              trigger={
                <button 
                  disabled={!!currentAccount}
                  className="w-full flex items-center justify-center gap-3 bg-[#030F1C] text-white border-2 border-[#4DA2FF] px-6 py-4 text-sm font-bold tracking-[0.5px] shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaWallet className="text-[#4DA2FF] flex-shrink-0" />
                  {currentAccount ? 'CONNECTED' : 'CONNECT WALLET'}
                </button>
              }
              open={open}
              onOpenChange={(isOpen) => setOpen(isOpen)}
            />

            <div className="flex items-center">
              <div className="flex-1 border-t border-white border-opacity-20"></div>
              <span className="px-4 text-white opacity-50 font-['Space_Mono'] text-xs tracking-[0.5px]">OR</span>
              <div className="flex-1 border-t border-white border-opacity-20"></div>
            </div>

            {googleWallet && (
              <button 
                onClick={() => connect({ wallet: googleWallet })}
                className="w-full flex items-center justify-center gap-3 bg-[#030F1C] text-white border-2 border-[#4DA2FF] px-6 py-4 text-sm font-bold tracking-[0.5px] shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer transition-all duration-200 hover:bg-[#4DA2FF] hover:text-[#121317] hover:scale-105"
              >
                <FaGoogle className="text-[#4DA2FF] flex-shrink-0" />
                SIGN IN WITH GOOGLE
              </button>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-white opacity-50 font-['Space_Mono'] text-xs tracking-[0.5px]">
              By connecting, you agree to our terms of service
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex justify-center gap-6 text-xs text-white opacity-50 font-['Space_Mono'] tracking-[0.5px]">
            <a href="#" className="hover:text-[#4DA2FF] transition-colors duration-200">Terms</a>
            <a href="#" className="hover:text-[#4DA2FF] transition-colors duration-200">Privacy</a>
            <a href="#" className="hover:text-[#4DA2FF] transition-colors duration-200">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
  