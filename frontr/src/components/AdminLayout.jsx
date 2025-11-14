import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useToggle } from '../hooks/useToggle';

const AdminLayout = ({ children }) => {
  const [isSidebarExpanded, sidebarActions] = useToggle(true);
  const [isMobileSidebarOpen, mobileSidebarActions] = useToggle(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size changes
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        if (isMobileSidebarOpen && !isSidebarExpanded) {
          sidebarActions.setTrue();
        }
      } else {
        mobileSidebarActions.setFalse();
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobileSidebarOpen, isSidebarExpanded]);

  const handleDesktopToggle = () => {
    sidebarActions.toggle();
  };

  const handleMobileMenuToggle = () => {
    mobileSidebarActions.toggle();
    // Pastikan sidebar expanded ketika dibuka di mobile
    if (!isMobileSidebarOpen && !isSidebarExpanded) {
      sidebarActions.setTrue();
    }
  };

  const handleCloseMobileSidebar = () => {
    mobileSidebarActions.setFalse();
  };

  // Class untuk main content yang responsif
  const mainContentClass = `
    flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out
    ${isSidebarExpanded && !isMobile ? 'md:ml-0' : 'md:ml-0'}
  `;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isExpanded={isSidebarExpanded}
        isMobileOpen={isMobileSidebarOpen}
        onClose={handleCloseMobileSidebar}
        onToggle={handleDesktopToggle}
        isMobile={isMobile}
      />
      
      {/* Main Content */}
      <div className={mainContentClass}>
        <Header onMenuToggle={handleMobileMenuToggle} />
        
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;