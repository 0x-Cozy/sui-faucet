export interface HeaderProps {
  toggleSidebar: () => void;
  handleLogout: () => void;
}

export interface SidebarProps {
  sidebarOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export interface MobileOverlayProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export interface MainContentProps {
  activeTab: string;
}

export interface LoginProps {
  onLogin: (token: string) => void;
}

export type TabType = 'dashboard' | 'users' | 'transactions' | 'analytics' | 'settings'; 