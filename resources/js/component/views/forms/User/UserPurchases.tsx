import React, { useEffect, useState, useRef } from 'react';
import { usePurchase } from '../../../context/PurchasesContext';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import Header from '../components/header';

const SeeMoreText = ({ text }: { text: string }) => {
  const [isTruncated, setIsTruncated] = useState(true);
  const toggleTruncate = () => setIsTruncated(!isTruncated);

  return (
    <div>
      <Typography variant="body2">
        {isTruncated ? text.substring(0, 6) : text}{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={toggleTruncate}
        >
          {isTruncated ? "... See More" : " See Less"}
        </span>
      </Typography>
    </div>
  );
};

export const PurchasesList: React.FC = () => {
  const { purchases, fetchPurchases, loading, error } = usePurchase();
  const { user } = useAuth(); // Fetch authenticated user details
  const hasFetched = useRef(false); // Ref to prevent refetching
  const [currentIndices, setCurrentIndices] = useState<{ [key: number]: number }>({}); // Store indices per request_id

  useEffect(() => {
    if (user?.id && !hasFetched.current) {
      fetchPurchases(user.id); // Fetch purchases dynamically based on the authenticated user
      hasFetched.current = true; // Mark as fetched
    }
  }, [fetchPurchases, user?.id]);

  const prevImage = (requestId: number, images: any[]) => {
    setCurrentIndices((prev) => ({
      ...prev,
      [requestId]: (prev[requestId] || 0) === 0 ? images.length - 1 : (prev[requestId] || 0) - 1,
    }));
  };

  const nextImage = (requestId: number, images: any[]) => {
    setCurrentIndices((prev) => ({
      ...prev,
      [requestId]: (prev[requestId] || 0) === images.length - 1 ? 0 : (prev[requestId] || 0) + 1,
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (purchases.length === 0) return <div>You haven&apos;t purchased anything yet.</div>;

  return (
    <div style={{ marginTop: '80px' }}> {/* Adjust the margin to match the header height */}
      <Header />
      <Grid container spacing={2} style={{ padding: '10px' }}>
        {purchases.map((purchase) => {
          const images = purchase.request.post.images || [];
          const currentIndex = currentIndices[purchase.request.request_id] || 0;

          return (
            <Grid item xs={12} sm={6} md={4} key={purchase.id}>
              <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://custme.site/storage/app/public/${images[currentIndex]?.image_path}` || '/default-image.jpg'}
                    alt={`Post Image ${images[currentIndex]?.image_id}`}
                    style={{ objectFit: 'cover' }}
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => prevImage(purchase.request.request_id, images)}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent text-black text-4xl px-2 py-3 rounded-full focus:outline-none hover:bg-gray-700 hover:bg-opacity-80 transition-all"
                      >
                        &#8249;
                      </button>
                      <button
                        onClick={() => nextImage(purchase.request.request_id, images)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent text-black text-4xl px-2 py-3 rounded-full focus:outline-none hover:bg-gray-800 hover:bg-opacity-80 transition-all"
                      >
                        &#8250;
                      </button>
                    </>
                  )}
                </div>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" style={{ fontSize: '0.85rem' }}>
                    Order ID: {purchase.request.request_id}
                  </Typography>
                  <Typography variant="h6" component="div" style={{ fontSize: '1rem', textAlign: 'center' }}>
                    <SeeMoreText text={purchase.request.post.title} />
                  </Typography>
                  <SeeMoreText text={purchase.request.post.content} />
                  <Typography variant="body1" style={{ fontSize: '0.9rem' }}>Amount: PHP{purchase.amount}</Typography>
                  <Typography variant="body2" color="text.secondary" style={{ fontSize: '0.85rem' }}>
                    Status: {purchase.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" style={{ fontSize: '0.85rem' }}>
                    Date: {new Date(purchase.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default PurchasesList;
