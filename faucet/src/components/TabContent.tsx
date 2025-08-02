import type { TabContentProps } from '../types';
import SuiDropContent from './SuiDropContent';
import RefundContent from './RefundContent';

const TabContent = ({ 
  activeTab, 
  walletAddress, 
  setWalletAddress, 
  sliderValue, 
  setSliderValue, 
  captchaCompleted, 
  handleCaptchaClick,
  onCaptchaSolved
}: TabContentProps & { onCaptchaSolved?: () => void }) => {

  const renderMainContent = () => {
    switch (activeTab) {
      case 'sui':
        return (
          <SuiDropContent
            walletAddress={walletAddress}
            setWalletAddress={setWalletAddress}
            sliderValue={sliderValue}
            setSliderValue={setSliderValue}
            captchaCompleted={captchaCompleted}
            handleCaptchaClick={handleCaptchaClick}
            onCaptchaSolved={onCaptchaSolved}
          />
        );
      
      case 'refund':
        return <RefundContent />;
      
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-full px-4 sm:px-8 md:px-0">
      <div className="flex justify-center">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default TabContent; 