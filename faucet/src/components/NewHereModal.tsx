import { useState } from 'react';
import { FaTimes, FaRocket, FaRecycle, FaGift, FaHeart, FaStar } from 'react-icons/fa';
//TODO
interface NewHereModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewHereModal = ({ isOpen, onClose }: NewHereModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <FaRocket className="w-8 h-8 text-[#4DA2FF]" />,
      title: "Welcome to First Movers! 🚀",
      description: "Get ready to explore the Sui blockchain with test tokens!",
      details: "This faucet gives you test SUI tokens to experiment with DeFi, NFTs, and more."
    },
    {
      icon: <FaGift className="w-8 h-8 text-[#4DA2FF]" />,
      title: "Get Your Test Tokens 💎",
      description: "Connect your wallet and request SUI tokens instantly!",
      details: "Just enter your wallet address, complete the captcha, and get your tokens. No strings attached!"
    },
    {
      icon: <FaRecycle className="w-8 h-8 text-[#4DA2FF]" />,
      title: "Refund When Done ♻️",
      description: "Return unused tokens to help other developers!",
      details: "The more you refund, the easier it'll be to get tokens next time. It's a win-win!"
    },
    {
      icon: <FaHeart className="w-8 h-8 text-[#4DA2FF]" />,
      title: "Build Something Amazing ✨",
      description: "Use your tokens to explore the Sui ecosystem!",
      details: "Test DeFi protocols, mint NFTs, or build your own dApp. The possibilities are endless!"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setCurrentStep(0);
    }
  };

  const handleSkip = () => {
    onClose();
    setCurrentStep(0);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={handleSkip}
      />
      <div className="fixed inset-4 sm:inset-8 md:inset-16 lg:inset-32 bg-[#050F1E] border-2 border-[#4DA2FF] rounded-sm z-50 overflow-hidden">
        <div className="flex flex-col h-full">
            
          <div className="flex justify-between items-center p-4 border-b border-[#4DA2FF] border-opacity-30">
            <h2 className="text-lg font-bold text-[#4DA2FF] font-['Space_Mono']">
              New Here? Let's Get You Started!
            </h2>
            <button
              onClick={handleSkip}
              className="text-white hover:text-[#4DA2FF] transition-colors duration-150"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <div className="text-center space-y-6">
              {/* Step Indicator */}
              <div className="flex justify-center space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentStep 
                        ? 'bg-[#4DA2FF] scale-125' 
                        : index < currentStep 
                        ? 'bg-[#4DA2FF] opacity-60' 
                        : 'bg-white opacity-30'
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-6">
                <div className="flex justify-center">
                  {steps[currentStep].icon}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[#4DA2FF] font-['Space_Mono']">
                    {steps[currentStep].title}
                  </h3>
                  
                  <p className="text-lg text-white font-['Space_Mono']">
                    {steps[currentStep].description}
                  </p>
                  
                  <p className="text-sm text-white opacity-70 font-['Space_Mono'] leading-relaxed">
                    {steps[currentStep].details}
                  </p>
                </div>

                <div className="bg-[#030F1C] border border-[#4DA2FF] border-opacity-30 rounded-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-bold text-[#4DA2FF] font-['Space_Mono']">
                      Pro Tip
                    </span>
                  </div>
                  <p className="text-xs text-white opacity-80 font-['Space_Mono']">
                    {currentStep === 0 && "Test tokens are free and unlimited - experiment freely!"}
                    {currentStep === 1 && "You can request tokens multiple times, but be considerate of others!"}
                    {currentStep === 2 && "Refunding helps the community and improves your reputation!"}
                    {currentStep === 3 && "Join our community to share your builds and get help!"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-[#4DA2FF] border-opacity-30">
            <div className="flex justify-between items-center">
              <button
                onClick={handleSkip}
                className="text-white opacity-70 hover:opacity-100 transition-opacity duration-200 font-['Space_Mono'] text-sm"
              >
                Skip Tutorial
              </button>
              
              <button
                onClick={handleNext}
                className="bg-[#4DA2FF] text-[#030F1C] px-6 py-2 rounded-sm font-['Space_Mono'] text-sm font-bold tracking-[0.5px] hover:bg-[#030F1C] hover:text-[#4DA2FF] hover:border-2 hover:border-[#4DA2FF] transition-all duration-200"
              >
                {currentStep === steps.length - 1 ? 'Get Started!' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewHereModal; 