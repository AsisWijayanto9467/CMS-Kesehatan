import React, { useState, useRef, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import { menuItems } from "../config/menuConfig";
import { useLocation } from "react-router-dom";



const Header = ({ onMenuToggle }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const userMenuRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const {logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async() => {
    const result = await Swal.fire({
      title: 'Keluar dari akun?',
      text: 'Apakah anda yakin ingin keluar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cencelButtonColor: '#d33',
      confirmButtonText: 'Ya, keluar',
      cancelButtonText: 'Batal',
      background: '#fff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
      }
    })

    if(result.isConfirmed) {
      try {
        await api.post("/logout");
      } catch(error) {
        console.log("Logout API error:", error)
      } finally {
        logout();
        localStorage.removeItem("token");

        localStorage.setItem('logoutSuccess', "true");

        navigate("/admin/login");
      }
    }
    
  }

  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Dashboard");

  useEffect(() => {
    // cari halaman yang cocok dari menu utama
    let foundItem =
      menuItems.find((item) => item.link === location.pathname) ||
      // jika tidak ditemukan, cari di submenu
      menuItems
        .flatMap((item) => item.submenu || [])
        .find((sub) => sub.link === location.pathname);

    // jika ada yang cocok, ubah title
    if (foundItem) {
      setPageTitle(foundItem.text);
    } else {
      setPageTitle("Dashboard"); // default
    }
  }, [location.pathname]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user menu when clicking outside
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      
      // Close mobile search when clicking outside
      if (showMobileSearch && mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        const searchToggle = document.getElementById('mobileSearchToggle');
        if (searchToggle && !searchToggle.contains(event.target)) {
          setShowMobileSearch(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileSearch]);

  return (
    <header className="bg-white shadow-sm z-30 relative">
      <div className="flex items-center justify-between p-4">
        {/* Left: Page Title & Mobile Menu Toggle */}
        <div className="flex items-center">
          <button 
            id="mobileMenuToggle" 
            className="mr-4 text-gray-600 md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={onMenuToggle}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>
            <p className="text-sm text-gray-500">Control panel</p>
          </div>
        </div>
        
        {/* Right: Header Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search - Hidden on mobile */}
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
            />
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          </div>
          
          {/* Mobile Search Toggle */}
          <button 
            id="mobileSearchToggle" 
            className="p-2 rounded-full hover:bg-gray-100 md:hidden transition-colors duration-200"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <i className="fas fa-search text-gray-600"></i>
          </button>
          
          {/* Mobile Search Input */}
          {showMobileSearch && (
            <div 
              id="mobileSearch" 
              ref={mobileSearchRef}
              className="absolute top-16 left-4 right-4 bg-white p-4 shadow-lg rounded-lg md:hidden z-40 animate-fade-in"
            >
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <i className="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
              </div>
            </div>
          )}
          
          {/* Messages */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
              <i className="fas fa-envelope text-gray-600"></i>
              <span className="notification-badge bg-red-500 text-white">4</span>
            </button>
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
              <i className="fas fa-bell text-gray-600"></i>
              <span className="notification-badge bg-yellow-500 text-white">10</span>
            </button>
          </div>
          
          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button 
              id="userMenuButton" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <i className="fas fa-user text-white text-sm"></i>
              </div>
              <span className="text-gray-700 hidden md:inline">Alexander Pierce</span>
              <i className="fas fa-caret-down text-gray-500 hidden md:inline"></i>
            </button>
            <div 
              id="userMenu" 
              className={`dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-10 border border-gray-100 ${showUserMenu ? 'show' : ''}`}
            >
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center">
                <i className="fas fa-user mr-3 w-4 text-center"></i>Profile
              </a>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center">
                <i className="fas fa-cog mr-3 w-4 text-center"></i>Settings
              </a>
              <div className="border-t border-gray-100 my-1"></div>
              <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center">
                <i className="fas fa-sign-out-alt mr-3 w-4 text-center"></i>Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;