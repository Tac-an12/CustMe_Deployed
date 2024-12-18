import React, { useEffect, useState } from 'react';
import { IconButton, Box, Typography, Divider, Paper, Badge, Button } from '@mui/material';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import echo from './../../../../../../src/echo'; // Adjust the import path if necessary
import { useNotification } from '../../../context/NotificationContext';

const NotificationsDropdown: React.FC = () => {
  const { notifications, setNotifications } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = (id: number) => {
    navigate(`/notifications/${id}`);
  };

  useEffect(() => {
    console.log("NotificationsDropdown component mounted. Listening for events...");

    // Listen for real-time notifications
    const channel = echo.channel('notifications')
      .listen('new-notification', (data: any) => {
        console.log("Received new-notification event:", data);

        // Add new notification to the state
        setNotifications((prevNotifications) => [data.notification, ...prevNotifications]);
      });

    // Log when the component unmounts and cleanup
    return () => {
      console.log("NotificationsDropdown component unmounted. Cleaning up...");
      echo.leaveChannel('notifications');
    };
  }, [setNotifications]);

  return (
    <Box position="relative" zIndex={50}>
      <IconButton
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          p: 1,
          '&:hover': { backgroundColor: 'primary.dark' },
        }}
      >
        <Badge badgeContent={notifications.length} color="error">
          <FaBell />
        </Badge>
      </IconButton>

      {isOpen && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            right: 0,
            mt: 1,
            width: 256,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 3,
            overflow: 'hidden',
          }}
        >
          <Box p={2}>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Notifications
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Box
              sx={{
                maxHeight: 256,
                overflowY: 'auto',
              }}
            >
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Box
                    key={notification.id}
                    py={1}
                    borderBottom="1px solid"
                    borderColor="grey.200"
                    sx={{
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                      },
                    }}
                    onClick={() => navigate('/notifications')} 
                  >
                    <Typography variant="body2" color="text.primary">
                      {notification.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.primary">
                  No notifications
                </Typography>
              )}
            </Box>
            <Button
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              sx={{ mt: 1, width: '100%' }}
              variant="contained"
              color="primary"
            >
              View All
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default NotificationsDropdown;
