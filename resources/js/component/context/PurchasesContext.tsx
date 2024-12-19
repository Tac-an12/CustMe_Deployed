import React, { createContext, useContext, useState, ReactNode } from 'react';
import apiService from '../services/apiService';

interface Purchase {
  id: number;
  amount: string;
  status: string;
  created_at: string;
  request: {
    request_id: number; // Include request_id
    post: {
      title: string;
      images: { image_id: number; image_path: string }[];
      content: string;
    };
    user: {
      username: string;
    };
  };
}

interface PurchaseContextProps {
  purchases: Purchase[];
  fetchPurchases: (userId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const PurchaseContext = createContext<PurchaseContextProps | undefined>(undefined);

interface PurchaseProviderProps {
  children: ReactNode;
}

export const PurchaseProvider: React.FC<PurchaseProviderProps> = ({ children }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchases = async (userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.get(`/purchases/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      setPurchases(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while fetching purchases.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PurchaseContext.Provider value={{ purchases, fetchPurchases, loading, error }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = (): PurchaseContextProps => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
};
