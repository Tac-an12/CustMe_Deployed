import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Divider, Modal } from '@mui/material';
import { useNotification } from '../../../context/NotificationContext';
import { useAuth } from '../../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Header from '../components/header';

const RequestForm: React.FC = () => {
    const {
        notifications,
        acceptNotification,
        declineNotification,
        userAccept,
        userDecline,
        selectedNotification,
        setSelectedNotification,
    } = useNotification();
    const { user } = useAuth(); // Access user info, including role
    const [isModalOpen, setModalOpen] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const successMessage = queryParams.get('success_message');
    const errorMessage = queryParams.get('error_message');

    // Helper functions to check user role
    const isUserRole = () => {
        return user && user.role.rolename === 'User';
    };

    const isDesignerOrProviderRole = () => {
        return user && (user.role.rolename === 'Printing Shop' || user.role.rolename === 'Graphic Designer');
    };

    const isAdminRole = () => {
        return user && user.role.rolename === 'Admin';
    };

    const handleNotificationClick = (notification: any) => {
        setSelectedNotification(notification);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedNotification(null);
        setModalOpen(false);
    };

    return (
        <Box className="p-4 mt-14">
            <Header />
            {successMessage && (
                <Typography variant="body1" className="text-green-600">
                    {successMessage}
                </Typography>
            )}
            {errorMessage && (
                <Typography variant="body1" className="text-red-600">
                    {errorMessage}
                </Typography>
            )}
            {notifications.length > 0 ? (
                notifications.map((notification) => {
                    const { id, status, request_id, content, created_at, target_user_id } = notification;

                    const bgColor =
                        status === 'accepted' ? 'rgba(16, 185, 129, 0.1)' :
                        status === 'declined' ? 'rgba(239, 68, 68, 0.1)' :
                        'white';

                    return (
                        <Paper
                            key={id}
                            className={`mb-2 p-4 transition-shadow duration-300 flex items-center justify-between`}
                            onClick={() => handleNotificationClick(notification)}
                            style={{ backgroundColor: bgColor }}
                        >
                            <div>
                                <Typography variant="body1" className="text-gray-800">
                                    {content}
                                </Typography>
                                <Typography variant="caption" className="text-gray-600">
                                    {new Date(created_at).toLocaleString()}
                                </Typography>
                                <Divider sx={{ my: 1 }} />

                                {/* Show buttons based on status and user role */}
                                {!isAdminRole() && status === 'pending' && (
                                    <Box display="flex" gap={1}>
                                        {/* Conditional button rendering for Designers/Printing Shops */}
                                        {isDesignerOrProviderRole() && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        acceptNotification(id, request_id); // Designer or Printing Shop Accept
                                                    }}
                                                    className="bg-blue-500 hover:bg-blue-600"
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        declineNotification(id, request_id); // Designer or Printing Shop Decline
                                                    }}
                                                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                >
                                                    Decline
                                                </Button>
                                            </>
                                        )}

                                        {/* Conditional button rendering for Users */}
                                        {isUserRole() && (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        userAccept(id, request_id); // User Accept
                                                    }}
                                                    className="bg-blue-500 hover:bg-blue-600"
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        userDecline(id, request_id); // User Decline
                                                    }}
                                                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                                >
                                                    Decline
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                )}

                                {/* Render accepted/declined status messages */}
                                {status === 'accepted' && user && target_user_id === user.id && (
                                    <Typography variant="body2" className="text-green-600 mt-2">
                                        You accepted this request.
                                    </Typography>
                                )}
                                {status === 'declined' && user && target_user_id === user.id && (
                                    <Typography variant="body2" className="text-red-600 mt-2">
                                        You declined this request.
                                    </Typography>
                                )}
                            </div>
                        </Paper>
                    );
                })
            ) : (
                <Typography variant="body2" className="text-gray-800">
                    No notification requests.
                </Typography>
            )}

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    {selectedNotification ? (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Notification Details
                            </Typography>
                            <Typography variant="body1">
                                <strong>Content:</strong> {selectedNotification.content}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Created At:</strong> {new Date(selectedNotification.created_at).toLocaleString()}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Price:</strong> {selectedNotification.price}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Request Content:</strong> {selectedNotification.request_content}
                            </Typography>
                            <Box mt={2}>
                                <Button variant="contained" onClick={handleCloseModal} fullWidth>
                                    Close
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Typography variant="body1">No data available.</Typography>
                    )}
                </Box>
            </Modal>
        </Box>
    );
};

export default RequestForm;
