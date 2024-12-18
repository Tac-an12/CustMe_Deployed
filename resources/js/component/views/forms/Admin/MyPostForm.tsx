import React, { useEffect } from 'react';
import { useArtistAndProvider } from '../../../context/Artist&ProviderContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';

const ArtistAndProviderList: React.FC = () => {
    const { profiles: artistAndPrintingProviders, fetchArtistAndProviderProfiles, loading } = useArtistAndProvider();
    const navigate = useNavigate();

    useEffect(() => {
        fetchArtistAndProviderProfiles();
    }, [fetchArtistAndProviderProfiles]);

    // Remove duplicates based on the `username` field
    const uniqueProviders = Array.from(new Set(artistAndPrintingProviders?.map(provider => provider.username)))
        .map(username => {
            return artistAndPrintingProviders?.find(provider => provider.username === username);
        }).filter(Boolean);

    const handleProfileClick = (providerId: number) => {
        navigate(`/clients/${providerId}/profile`);
    };

    return (
        <div className="artist-provider-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20">
            <Header />
            {loading ? (
                <p>Loading artists and providers...</p>
            ) : artistAndPrintingProviders && uniqueProviders.length > 0 ? (
                uniqueProviders.map((provider) => {
                    const username = provider?.username || 'Username Unavailable';
                    const role = provider?.role_name || 'Role Unavailable';
                    
                    // Inline approach to set image URLs based on availability
                    const profilePicture = provider?.personal_information?.profilepicture
                        ? `https://custme.site/storage/app/public/${provider.personal_information.profilepicture}`
                        : '/default-avatar.png';

                    return (
                        <div 
                            key={provider?.id} 
                            className="provider-card border rounded shadow p-4 cursor-pointer" 
                            onClick={() => handleProfileClick(provider?.id)}
                        >
                            <img
                                src={profilePicture}
                                alt={username}
                                className="provider-avatar w-full h-32 object-cover rounded-t"
                            />
                            <div className="provider-info mt-2">
                                <h3 className="text-lg font-semibold">{username}</h3>
                                <p className="text-sm text-gray-600">{role}</p>
                            </div>
                        </div>
                    );
                })
            ) : (
                <p>No artists or printing providers found.</p>
            )}
        </div>
    );
};

export default ArtistAndProviderList;
