interface MobileOverlayProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const MobileOverlay = ({ sidebarOpen, toggleSidebar }: MobileOverlayProps) => {
  if (!sidebarOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
      onClick={toggleSidebar}
    />
  );
};

export default MobileOverlay; 