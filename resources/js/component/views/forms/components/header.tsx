import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FaSignOutAlt, FaPlus } from 'react-icons/fa';
import { Search as SearchIcon } from '@mui/icons-material';
import { InputBase } from '@mui/material';
import NotificationsDropdown from '../components/NotificationsDropDown';
import Avatar from '@mui/material/Avatar';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import SearchBar from '../../../views/searchbar';
import PostSearchBar from '../../../views/PostsSearchBar';

import DashboardIcon from '@mui/icons-material/Dashboard';
import ChatIcon from '@mui/icons-material/Chat';
import BrushIcon from '@mui/icons-material/Brush';
import PrintIcon from '@mui/icons-material/Print';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MapIcon from '@mui/icons-material/Map';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group'; 
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; 
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; 
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'; 




interface HeaderProps {
  onLocationSelect?: (location: any) => void;
  onPostSearchSelect?: (post: any) => void;
}

const Header: React.FC<HeaderProps> = ({ onLocationSelect, onPostSearchSelect }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isUserRole = () => {
    return user && (user.role.rolename === 'User');
  };
  const isAdminRole = () => {
    return user && (user.role.rolename === 'Admin');
  };
  const isDesingerOrProviderRole = () => {
    return user && (user.role.rolename === 'Printing Shop' || user.role.rolename === 'Graphic Designer');
  };
  const isMultipleRole = () => {
    return user && (user.role.rolename === 'Printing Shop' || user.role.rolename === 'Graphic Designer' || user.role.rolename === 'User');
  };

  return (
    <>
      {/* AppBar */}
      {/* AppBar */}
<AppBar
  position="fixed"
  color="inherit"
  elevation={1}
  sx={{
    backgroundColor: '#fff',
    zIndex: (theme) => theme.zIndex.drawer + 1,
    paddingX: { xs: 1, sm: 2 }, // Adjust padding for mobile and desktop
  }}
>
  <Toolbar
    sx={{
      justifyContent: 'space-between',
      px: { xs: 1, sm: 2 },
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: { xs: '56px', sm: '64px' }, // Adjust toolbar height for mobile and desktop
    }}
  >
    {/* Menu Icon for Sidebar */}
    <IconButton
      edge="start"
      aria-label="menu"
      onClick={toggleSidebar}
      sx={{
        marginRight: 2,
        color: 'black',
        display: { xs: 'block', sm: 'block' },
      }}
    >
      <MenuIcon />
    </IconButton>

    {/* Logo */}
    <Box display="flex" alignItems="center" sx={{ flexGrow: 2 }}>
  <Box
    className="text-black font-extrabold"
    sx={{
      fontSize: { xs: '1.5rem', sm: '1.5rem', md: '2rem' }, // Font size adjustments for responsiveness
      ml: { xs: 0, sm: 2 }, // Remove margin for mobile (xs), added margin for larger screens (sm and above)
      display: 'flex',
      
      justifyContent: { xs: 'flex-start',}, // Align left for mobile, center for larger screens
    }}
  >
    <span className="text-blue-500">C</span>
    <span className="text-blue-500">u</span>
    <span className="text-blue-500">s</span>
    <span className="text-yellow-500">t</span>
    <span className="text-blue-500">M</span>
    <span className="text-yellow-500">e</span>
  </Box>
</Box>


    {/* Conditional Search Bar */}
    {window.location.href === 'http://127.0.0.1:8000/getlocation' && (
      <SearchBar onLocationSelect={onLocationSelect} />
    )}

    {(location.pathname === '/dashboard' ||
      location.pathname === '/designerpost' ||
      location.pathname === '/providerpost') && (
      <PostSearchBar onPostSelect={onPostSearchSelect} />
    )}

    {/* Profile & Notifications */}
    <Box display="flex" alignItems="center" sx={{ ml: 'auto' }}>
      <NotificationsDropdown />

      {user && (
        <Box ml={2}>
          <NavLink to={`/clients/${user.id}/profile`}>
            <Avatar
              src={`https://custme.site/storage/app/public/${
                user.personal_information?.profilepicture || 'images/default-profile.png'
              }`}
              alt="Profile"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                '&:hover': {
                  cursor: 'pointer',
                },
              }}
            />
          </NavLink>
        </Box>
      )}
    </Box>
  </Toolbar>
</AppBar>


      {/* Sidebar with Overlay */}
      <Drawer
        anchor="left"
        open={isSidebarExpanded}
        variant="temporary"
        onClose={toggleSidebar}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: isSidebarExpanded ? 240 : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isSidebarExpanded ? 240 : 60,
            backgroundColor: '#1976d2',
            color: 'white',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            border: 'none',
            padding: 0,
            margin: 0,
            boxShadow: 'none',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {user && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              mt={10}
            >
              {/* <Avatar
                src={user.personal_information?.profilepicture || 'https://via.placeholder.com/40'}
                alt="Profile"
                sx={{
                  width: isSidebarExpanded ? 64 : 40,
                  height: isSidebarExpanded ? 64 : 40,
                  transition: 'width 0.3s ease, height 0.3s ease',
                }}
              /> */}
              {/* {isSidebarExpanded && (
                <NavLink
                  to={`/clients/${user.id}/profile`}
                  className="text-white text-sm hover:underline"
                  style={{ marginTop: '8px' }}
                >
                  {user.username}
                </NavLink>
              )} */}
            </Box>
          )}

          {/* List of Icons */}
          <List sx={{ mt: 3 }}>
            {isUserRole() && (
              <NavLink to="/dashboard" className="text-white">
                <ListItem>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <DashboardIcon />
                  </ListItemIcon>
                  {isSidebarExpanded && <ListItemText primary="Dashboard" />}
                </ListItem>
              </NavLink>
            )}
               {isDesingerOrProviderRole() && (  
            <NavLink to="/user" className="text-white">
              <ListItem>
                <ListItemIcon sx={{ color: 'white' }}>
                  <DescriptionIcon />
                </ListItemIcon>
                {isSidebarExpanded && <ListItemText primary="My Post" />}
              </ListItem>
            </NavLink>
                  )}

    {isAdminRole() && (  
                <NavLink to="/admin" className="text-white">
                  <ListItem>
                    <ListItemIcon sx={{ color: 'white' }}>
                      <DescriptionIcon />
                    </ListItemIcon>
                    {isSidebarExpanded && <ListItemText primary="Reports" />}
                  </ListItem>
                </NavLink>
      )}
            {isMultipleRole() && (
              <NavLink to="/paymentstable" className="text-white">
                <ListItem>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  {isSidebarExpanded && <ListItemText primary="Transaction" />}
                </ListItem>
              </NavLink>
            )}

            {isMultipleRole() && (
              <NavLink to="/chats" className="text-white">
                <ListItem>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <ChatIcon />
                  </ListItemIcon>
                  {isSidebarExpanded && <ListItemText primary="Chat" />}
                </ListItem>
              </NavLink>
            )}

            {isDesingerOrProviderRole() && (
              <NavLink to="/clientpost" className="text-white">
                <ListItem>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <BrushIcon />
                  </ListItemIcon>
                  {isSidebarExpanded && <ListItemText primary="Clients Post" />}
                </ListItem>
              </NavLink>
            )}

{isUserRole() && (
              <NavLink to="/user" className="text-white">
                <ListItem>
                  <ListItemIcon sx={{ color: 'white' }}>
                  <InsertDriveFileIcon />
                  </ListItemIcon>
                  {isSidebarExpanded && <ListItemText primary="My Post" />}
                </ListItem>
              </NavLink>
            )}

            {isMultipleRole() && (
              <NavLink to="/posts" className="text-white">
                <ListItem>
                  <ListItemIcon sx={{ color: 'white' }}>
                    <FaPlus />
                  </ListItemIcon>
                  {isSidebarExpanded && <ListItemText primary="Add Post" />}
                </ListItem>
              </NavLink>
            )}
          </List>

          {isUserRole() && (
            <NavLink to="/getlocation" className="text-white">
              <ListItem>
                <ListItemIcon sx={{ color: 'white' }}>
                  <MapIcon />
                </ListItemIcon>
                {isSidebarExpanded && <ListItemText primary="Nearby" />}
              </ListItem>
            </NavLink>
          )}

      {isUserRole() && (
            <NavLink to="/meet-the-team" className="text-white">
              <ListItem>
                <ListItemIcon sx={{ color: 'white' }}>
                <GroupIcon />
                </ListItemIcon>
                {isSidebarExpanded && <ListItemText primary="Designer & Provider" />}
              </ListItem>
            </NavLink>
          )}

          {isDesingerOrProviderRole() && (
            <NavLink to="/share-location" className="text-white">
              <ListItem>
                <ListItemIcon sx={{ color: 'white' }}>
                  <MapIcon />
                </ListItemIcon>
                {isSidebarExpanded && <ListItemText primary="Add location" />}
              </ListItem>
            </NavLink>
          )}
          {isAdminRole() && (
            <NavLink to="/users" className="text-white">
              <ListItem>
                <ListItemIcon sx={{ color: 'white' }}>
                  <MapIcon />
                </ListItemIcon>
                {isSidebarExpanded && <ListItemText primary="User List" />}
              </ListItem>
            </NavLink>
          )}

          {/* Logout */}
          <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'center' }}>
            <ListItem onClick={handleLogout} sx={{ color: 'white' }}>
              <ListItemIcon sx={{ color: 'white' }}>
              <ExitToAppIcon />
              </ListItemIcon>
              {isSidebarExpanded && <ListItemText primary="Logout" />}
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      {/* Overlay when sidebar is open */}
      {isSidebarExpanded && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          }}
          onClick={toggleSidebar} // Close sidebar when overlay is clicked
        />
      )}
    </>
  );
};

export default Header;