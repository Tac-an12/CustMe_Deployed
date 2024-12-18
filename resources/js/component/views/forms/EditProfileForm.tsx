import React, { useState, useEffect } from 'react';
import { Modal, Button, TextField, Typography } from '@mui/material';
import { useClientProfile } from '../../context/ClientProfileContext';

interface EditProfileModalProps {
    open: boolean;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ open, onClose }) => {
    const { profile, updateProfile } = useClientProfile();

    // State variables for form fields
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [profilepicture, setProfilePicture] = useState<File | undefined>(undefined);
    const [coverphoto, setCoverPhoto] = useState<File | undefined>(undefined);

    // Populate form fields when the profile data or modal state changes
    useEffect(() => {
        if (profile?.personal_information && open) {
            setFirstname(profile.personal_information.firstname || '');
            setLastname(profile.personal_information.lastname || '');
            setZipcode(profile.personal_information.zipcode || ''); // Populate zipcode
            setProfilePicture(undefined); // Reset selected files on modal open
            setCoverPhoto(undefined);
        }
    }, [profile, open]);

    const handleFileChange = (
        file: File | undefined,
        setter: React.Dispatch<React.SetStateAction<File | undefined>>,
    ) => {
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (allowedTypes.includes(file.type)) {
                setter(file);
            } else {
                alert('Invalid file type. Only JPG, JPEG, and PNG are allowed.');
            }
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validate that the zipcode is exactly 11 digits
        if (zipcode.length !== 11 || isNaN(Number(zipcode))) {
            alert('Phone must be exactly 11 digits long');
            return;
        }

        if (profile?.id) {
            await updateProfile(profile.id, { firstname, lastname, zipcode }, { profilepicture, coverphoto });
            onClose();
        }
    };

    // Current images URLs
    const currentProfilePicture = profile?.personal_information.profilepicture
        ? `https://custme.site/storage/app/public/${profile.personal_information.profilepicture}`
        : null;

    const currentCoverPhoto = profile?.personal_information.coverphoto
        ? `https://custme.site/storage/app/public/${profile.personal_information.coverphoto}`
        : null;

    if (!profile) {
        return null; // Early return if profile is null
    }

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex flex-col items-center justify-center bg-white rounded shadow-lg fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-hidden">
                <Typography variant="h6" className="mb-4">Edit Profile</Typography>
                <form onSubmit={handleSubmit} className="w-full max-w-md p-4 overflow-auto">
                    <TextField
                        label="First Name"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Last Name"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    {/* Zipcode field */}
                    <TextField
                        label="Phone Number"
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                        fullWidth
                        margin="normal"
                        inputProps={{
                            maxLength: 11, // Enforce maximum length of 11
                            minLength: 11,  // Enforce minimum length of 11
                            pattern: "[0-9]*", // Only accept numeric input
                        }}
                        error={zipcode.length !== 11 || isNaN(Number(zipcode))}
                        helperText={
                            zipcode.length !== 11 || isNaN(Number(zipcode))
                                ? 'Zipcode must be exactly 11 digits'
                                : ''
                        }
                    />

                    {/* Current Profile Picture */}
                    {currentProfilePicture && (
                        <div className="mt-4">
                            <Typography variant="body2">Current Profile Photo:</Typography>
                            <img
                                src={currentProfilePicture}
                                alt="Current Profile"
                                className="w-32 h-32 object-cover rounded mt-1"
                            />
                        </div>
                    )}
                    <label className="block mb-2 mt-2">Change Profile Photo:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files?.[0], setProfilePicture)}
                    />
                    {profilepicture && (
                        <div className="mt-2">
                            <Typography variant="body2">Selected Profile Photo:</Typography>
                            <img
                                src={URL.createObjectURL(profilepicture)}
                                alt="Profile Preview"
                                className="w-32 h-32 object-cover rounded mt-1"
                            />
                        </div>
                    )}

                    {/* Current Cover Photo */}
                    {currentCoverPhoto && (
                        <div className="mt-4">
                            <Typography variant="body2">Current Cover Photo:</Typography>
                            <img
                                src={currentCoverPhoto}
                                alt="Current Cover"
                                className="w-full h-20 object-cover rounded mt-1"
                            />
                        </div>
                    )}
                    <label className="block mb-2 mt-2">Change Cover Photo:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e.target.files?.[0], setCoverPhoto)}
                    />
                    {coverphoto && (
                        <div className="mt-2">
                            <Typography variant="body2">Selected Cover Photo:</Typography>
                            <img
                                src={URL.createObjectURL(coverphoto)}
                                alt="Cover Preview"
                                className="w-full h-20 object-cover rounded mt-1"
                            />
                        </div>
                    )}

                    <div className="mt-4">
                        <Button type="submit" variant="contained" color="primary" disabled={zipcode.length !== 11 || isNaN(Number(zipcode))}>Save</Button>
                        <Button onClick={onClose} variant="outlined" color="secondary" className="ml-2">Cancel</Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default EditProfileModal;
