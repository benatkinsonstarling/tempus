import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { UserCircle } from 'lucide-react';

interface SidebarProps {
  isLight: boolean;
  onAuthClick: () => void;
}

const AppSidebar: React.FC<SidebarProps> = ({ isLight, onAuthClick }) => {
  const textColor = isLight ? 'text-gray-800' : 'text-white';

  return (
    <Sidebar className="w-[50px] transition-all duration-300 ease-in-out hover:w-[200px]">
      <SidebarFooter className="pb-4">
        <button 
          onClick={onAuthClick}
          className={`flex items-center justify-center w-full p-2 ${textColor} hover:bg-opacity-20 hover:bg-gray-500 rounded-md transition-colors duration-200`}
        >
          <UserCircle size={24} />
          <span className="ml-2 hidden sidebar-expanded:inline">Profile</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
