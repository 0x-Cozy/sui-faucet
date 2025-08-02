import { FaBars, FaSignOutAlt } from 'react-icons/fa';

interface HeaderProps {
  toggleSidebar: () => void;
  handleLogout: () => void;
}

const Header = ({ toggleSidebar, handleLogout }: HeaderProps) => {
  return (
    <header className="h-[100px] border-box flex justify-between items-center px-4 sm:px-8 md:px-12 pt-4 sm:pt-4 md:pt-0 relative z-10 border-b-2 border-sui-border">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="md:hidden bg-sui-dark border-2 border-sui-blue p-2 rounded-sm hover:bg-sui-blue hover:text-sui-dark transition-all duration-200 flex items-center justify-center"
        >
          <FaBars className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl md:text-[1.7rem] font-black text-sui-blue uppercase tracking-[1px] sm:tracking-[2px] md:tracking-[3px] font-space-mono">
          FIRST MOVERS
        </h1>
      </div>
      
      <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-white opacity-70 tracking-[0.5px] sm:tracking-[1px] items-center">
        <span className="text-sui-blue font-bold hidden sm:block">Admin Panel</span>
        <button 
          onClick={handleLogout}
          className="bg-sui-dark text-white border-2 border-sui-blue px-2 sm:px-3 py-1 sm:py-2 text-xs font-bold text-center shadow-[0_0_3px_rgba(111,188,240,0.6)] cursor-pointer tracking-[0.5px] transition-all duration-200 hover:bg-sui-blue hover:text-sui-dark hover:scale-105 flex items-center gap-2"
        >
          <FaSignOutAlt className="w-3 h-3" />
          LOGOUT
        </button>
      </div>
    </header>
  );
};

export default Header; 