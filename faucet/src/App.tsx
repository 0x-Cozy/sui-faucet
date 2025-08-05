import { useState } from 'react';
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import RegisterEnokiWallets from "./components/RegisterEnokiWallets";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { darkTheme } from './themes/darkTheme';
import "@mysten/dapp-kit/dist/index.css";
import "./App.css";

import { ThunderEffect, Navigation, Footer, CornerDecorations, TabContent } from './components';
import ApiManagement from './components/ApiManagement';
import ApiDocumentation from './components/ApiDocumentation';
import { useRippleEffect } from './hooks/useRippleEffect';
import { TABS, SLIDER_DEFAULTS, THUNDER_THRESHOLD } from './constants';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Login';




const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
});

const queryClient = new QueryClient();

function AppInner() {
  const [sliderValue, setSliderValue] = useState<number>(SLIDER_DEFAULTS.INITIAL_VALUE);
  const [activeTab, setActiveTab] = useState<string>(TABS.SUI);
  const [walletAddress, setWalletAddress] = useState('');
  const [captchaCompleted, setCaptchaCompleted] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  
  const rippleRef = useRippleEffect(sliderValue);

  const handleCaptchaClick = () => {
    setCaptchaCompleted(true);
  };

  const handleCaptchaSolved = () => {
    setShowDrawer(true);
  };

  return (
    <>
    <div className="min-h-screen bg-[#030F1C] text-white font-['Orbitron'] relative overflow-hidden">
      <div
        id="ripple"
        ref={rippleRef}
        style={{
          height: '100vh',
          width: '100vw',
          position: 'fixed',
          zIndex: 0,
          left: 0,
          top: 0,
          background: "url('/none.png') no-repeat center center"
        }}
      />
      
        <ThunderEffect show={sliderValue >= THUNDER_THRESHOLD} />
        
        <Navigation />

        <TabContent 
          activeTab={activeTab}
          walletAddress={walletAddress}
          setWalletAddress={setWalletAddress}
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
          captchaCompleted={captchaCompleted}
          handleCaptchaClick={handleCaptchaClick}
          onCaptchaSolved={handleCaptchaSolved}
        />

        <Footer 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          captchaCompleted={captchaCompleted}
        />
        
        <CornerDecorations />
      </div>
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <RegisterEnokiWallets />
        <WalletProvider 
          autoConnect
          theme={[
            { variables: darkTheme },
          ]}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppInner />} />
              <Route path="/login" element={<Login />} />
              <Route path="/api" element={<ApiManagement />} />
              <Route path="/api/docs" element={<ApiDocumentation />} />
            </Routes>
          </BrowserRouter>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}