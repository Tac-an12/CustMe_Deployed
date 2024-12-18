import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/apiService"; // Adjust the path based on your folder structure

interface SalesReport {
  total_sales: number;
  graphic_designer_sales: number;
  printing_provider_sales: number;
  highest_sale: number;
  user_counts: Record<string, number>;
}

interface SalesReportContextValue {
  salesReport: SalesReport | null;
  loading: boolean;
  error: string | null;
  fetchSalesReport: () => void;
}

const SalesReportContext = createContext<SalesReportContextValue | undefined>(
  undefined
);

export const SalesReportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSalesReport = async () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      setError("Authorization token is missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Make the API request with the Bearer token in the headers
      const response = await apiService.get("/sales-report", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setSalesReport(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch sales report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      fetchSalesReport();
    } else {
      setError("Authorization token is missing");
    }
  }, []); // Only run on initial mount

  return (
    <SalesReportContext.Provider
      value={{ salesReport, loading, error, fetchSalesReport }}
    >
      {children}
    </SalesReportContext.Provider>
  );
};

export const useSalesReport = () => {
  const context = useContext(SalesReportContext);
  if (!context) {
    throw new Error("useSalesReport must be used within a SalesReportProvider");
  }
  return context;
};
