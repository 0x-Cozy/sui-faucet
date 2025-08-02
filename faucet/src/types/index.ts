export interface ThunderEffectProps {
  show: boolean;
}

export interface FooterProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface RainSliderProps {
  sliderValue: number;
  setSliderValue: (value: number) => void;
}

export interface TabContentProps {
  activeTab: string;
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  sliderValue: number;
  setSliderValue: (value: number) => void;
  captchaCompleted: boolean;
  handleCaptchaClick: () => void;
}

export type TabType = 'sui' | 'refund';
