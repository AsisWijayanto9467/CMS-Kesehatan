import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { menuItems } from "../config/menuConfig";

const Sidebar = ({ isExpanded, isMobileOpen, onClose, onToggle, isMobile }) => {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [hasInitialized, setHasInitialized] = useState(false); // Tambahan state untuk tracking inisialisasi
  const location = useLocation();

  

  const toggleSubmenu = (key) => {
    // Cegah toggle submenu jika sidebar tertutup di mode desktop
    if (!isMobile && !isExpanded) return;

    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (!hasInitialized) {
      const activeParent = menuItems.find(
        (item) =>
          item.submenu && item.submenu.some((sub) => sub.link === location.pathname)
      );

      if (activeParent) {
        setOpenSubmenus((prev) => ({
          ...prev,
          [activeParent.key]: true,
        }));
      }
      setHasInitialized(true);
    }
  }, [hasInitialized, location.pathname]);

  const handleMenuItemClick = (item) => {
    if (!isMobile && !isExpanded && !item.submenu) return;

    if (isMobile && !item.submenu) {
      onClose();
    }
  };


  const handleSubmenuItemClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  const sidebarClass = `
    sidebar-transition bg-blue-800 text-white flex flex-col fixed md:relative z-50 md:z-auto h-full
    ${isMobile ? "w-64" : isExpanded ? "w-64" : "w-16"}
    ${isMobileOpen ? "left-0" : "-left-full"}
    md:left-0
  `;

  const overlayClass = `
    fixed inset-0 bg-black bg-opacity-50 z-40 transition-all duration-300 ease-in-out
    ${isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
    md:hidden
  `;

  return (
    <>
      <div className={overlayClass} onClick={onClose} />

      <div className={sidebarClass}>
        {!isMobile && (
          <div className="toggle-container hidden md:block">
            <button
              id="desktopSidebarToggle"
              className="toggle-button group"
              onClick={onToggle}
            >
              <i
                className={`${
                  isExpanded ? "fas fa-chevron-left" : "fas fa-bars"
                } transition-transform duration-300 group-hover:scale-110`}
              ></i>
              <span className="toggle-tooltip">
                {isExpanded ? "Collapse" : "Expand"}
              </span>
            </button>
          </div>
        )}

        {/* Logo Section */}
        <div className="p-4 flex items-center justify-between border-b border-blue-700 relative">
          <div className="flex items-center min-w-0">
            <i className="fas fa-tachometer-alt text-xl mr-3 flex-shrink-0"></i>
            <span
              className={`text-xl font-bold logo-text truncate ${
                isMobile || isExpanded ? "block" : "hidden"
              }`}
            >
              Admin Menu
            </span>
          </div>

          {isMobile && (
            <button
              className="close-mobile-button group relative"
              onClick={onClose}
            >
              <i className="fas fa-times text-lg transition-transform duration-200 group-hover:rotate-90"></i>
              <span className="button-ripple"></span>
            </button>
          )}
        </div>

        {/* User Panel */}
        <div className="user-panel p-4 border-b border-blue-700 flex items-center hover:bg-blue-750 transition-all duration-200 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:bg-blue-500 hover:scale-105">
            <i className="fas fa-user transition-transform duration-300 hover:scale-110"></i>
          </div>
          <div
            className={`ml-3 user-panel-text min-w-0 ${
              isMobile || isExpanded ? "block" : "hidden"
            }`}
          >
            <p className="font-semibold truncate">Alexander Pierce</p>
            <p className="text-xs text-blue-200">Online</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.key} className="menu-item relative">
                {item.submenu ? (
                  <>
                    {/* Main menu with submenu */}
                    <div
                      className="sidebar-item group flex items-center p-3 rounded-md cursor-pointer hover:bg-blue-700 transition-all duration-200 relative overflow-hidden mb-2"
                      onClick={() => toggleSubmenu(item.key)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10 flex items-center w-full">
                        <i className={`${item.icon} w-6 text-center flex-shrink-0`}></i>
                        <span
                          className={`ml-3 sidebar-text truncate ${
                            isMobile || isExpanded ? "block" : "hidden"
                          }`}
                        >
                          {item.text}
                        </span>
                        <i
                          className={`fas fa-angle-left ml-auto transition-all duration-300 sidebar-text flex-shrink-0 ${
                            isMobile || isExpanded ? "block" : "hidden"
                          } ${
                            openSubmenus[item.key] ? "rotate-90 transform" : ""
                          }`}
                        ></i>
                      </div>
                    </div>

                    {/* Submenu with animation */}
                    <ul
                      className={`
                        overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                        ${openSubmenus[item.key] ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"}
                        ${isMobile || isExpanded ? "pl-6" : "pl-3"}
                        flex flex-col gap-1
                      `}
                    >
                      {item.submenu.map((subItem, index) => (
                        <li key={`${item.key}-${index}`} className="relative">
                          <Link
                            to={subItem.link}
                            className={`sidebar-item group flex items-center p-3 rounded-md text-sm transition-all duration-200 relative overflow-hidden
                              ${location.pathname === subItem.link ? "bg-blue-600" : "hover:bg-blue-600"}
                            `}
                            onClick={(e) => {
                              if (!isMobile && !isExpanded) {
                                e.preventDefault(); // cegah redirect jika sidebar collapse
                              } else {
                                handleSubmenuItemClick();
                              }
                            }}
                          >
                            {/* Hindari overlay yang menutupi icon */}
                            <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>

                            {/* Icon tetap tampil dan tidak hilang */}
                            <i
                              className={`${subItem.icon} w-5 text-center mr-2 flex-shrink-0 transition-transform duration-200 ${
                                location.pathname === subItem.link ? "text-white scale-110" : "text-blue-200 group-hover:text-white"
                              }`}
                            ></i>

                            <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-2">
                              {subItem.text}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    to={item.link}
                    className={`sidebar-item group flex items-center p-3 rounded-md transition-all duration-200 relative overflow-hidden mb-2
                      ${location.pathname === item.link ? "bg-blue-700" : "hover:bg-blue-700"}
                    `}
                    onClick={() => handleMenuItemClick(item)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex items-center w-full">
                      <i
                        className={`${item.icon} w-6 text-center flex-shrink-0 transition-transform duration-200 ${
                          location.pathname === item.link
                            ? "text-white scale-110"
                            : "group-hover:scale-110"
                        }`}
                      ></i>
                      <span
                        className={`ml-3 sidebar-text truncate ${
                          isMobile || isExpanded ? "block" : "hidden"
                        }`}
                      >
                        {item.text}
                      </span>
                    </div>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-blue-700 md:hidden">
          <div className="text-center text-blue-200 text-sm">
            <p>Admin Home</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;