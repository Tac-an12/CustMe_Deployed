import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Menu as MenuIcon } from '@mui/icons-material';
import Drawer from '@mui/material/Drawer';

const HomeHeader = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setSidebarOpen(false);
  };

  return (
    <>
      {/* AppBar for desktop */}
      <AppBar position="static" sx={{ backgroundColor: '#fff' }}>
        <Toolbar className="flex justify-between items-center px-4">
          {/* Logo */}
          <div className="text-black font-extrabold text-4xl ml-8">
            <span className="text-blue-500">C</span>
            <span className="text-blue-500">u</span>
            <span className="text-blue-500">s</span>
            <span className="text-yellow-500">t</span>
            <span className="text-blue-500">M</span>
            <span className="text-yellow-500">e</span>
          </div>

          {/* Navigation Links for desktop */}
          <div className="hidden md:flex flex-grow justify-end items-center">
            <NavLink to="/" className="text-black font-semibold mx-4 cursor-pointer hover:text-blue-500">
              Home
            </NavLink>
            <span
              className="text-black font-semibold mx-4 cursor-pointer hover:text-blue-500"
              onClick={() => handleScroll('about')}
            >
              About
            </span>
            <span
              className="text-black font-semibold mx-4 cursor-pointer hover:text-blue-500"
              onClick={() => handleScroll('services')}
            >
              Services
            </span>
            <NavLink to="/login" className="text-black font-semibold mx-4 cursor-pointer hover:text-yellow-500">
              Sign In
            </NavLink>
            <NavLink to="/register" className="text-black font-semibold mx-4 cursor-pointer hover:text-yellow-500">
              Sign Up
            </NavLink>
          </div>

          {/* Menu Icon for mobile */}
          <div className="md:hidden flex items-center">
            <MenuIcon className="text-black" onClick={toggleSidebar} />
          </div>
        </Toolbar>
      </AppBar>

      {/* Sidebar (Drawer) for mobile */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          width: '80%',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '80%',
            backgroundColor: '#fff',
          },
        }}
      >
        <div className="flex flex-col p-6">
          {/* Logo in Sidebar */}
          <div className="text-black font-extrabold text-4xl mb-6">
            <span className="text-blue-500">C</span>
            <span className="text-blue-500">u</span>
            <span className="text-blue-500">s</span>
            <span className="text-yellow-500">t</span>
            <span className="text-blue-500">M</span>
            <span className="text-yellow-500">e</span>
          </div>

          {/* Navigation Links in Sidebar */}
          <NavLink
            to="/"
            className="text-black font-semibold py-2 cursor-pointer hover:text-blue-500 text-2xl sm:text-3xl"
            onClick={toggleSidebar}
          >
            Home
          </NavLink>
          <span
            className="text-black font-semibold py-2 cursor-pointer hover:text-blue-500 text-2xl sm:text-3xl"
            onClick={() => handleScroll('about')}
          >
            About
          </span>
          <span
            className="text-black font-semibold py-2 cursor-pointer hover:text-blue-500 text-2xl sm:text-3xl"
            onClick={() => handleScroll('services')}
          >
            Services
          </span>
          <NavLink
            to="/login"
            className="text-black font-semibold py-2 cursor-pointer hover:text-yellow-500 text-2xl sm:text-3xl"
            onClick={toggleSidebar}
          >
            Sign In
          </NavLink>
          <NavLink
            to="/register"
            className="text-black font-semibold py-2 cursor-pointer hover:text-yellow-500 text-2xl sm:text-3xl"
            onClick={toggleSidebar}
          >
            Sign Up
          </NavLink>
        </div>
      </Drawer>
    </>
  );
};

export default HomeHeader;
