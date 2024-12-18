import React, { useEffect } from "react";
import { useAdminPaymentContext } from "../context/AdminPaymentContext";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "./forms/components/header";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/apiService";

const PaymentsTable = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen size is small
  const {
    requests = [],
    loading,
    error,
    fetchRequestPayments,
  } = useAdminPaymentContext();
  const { user } = useAuth();

  useEffect(() => {
    if (requests.length === 0 && !loading) {
      fetchRequestPayments();
    }
  }, [requests.length, loading, fetchRequestPayments]);

  const handlePayment = async (requestId) => {
    try {
      const response = await apiService.post(`/payforproduct80/${requestId}`);
      if (response.data && response.data.checkout_url) {
        window.open(response.data.checkout_url, "_blank");
        await fetchRequestPayments();
      } else {
        console.error(
          "Failed to get checkout URL:",
          response.data.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-medium mt-4">
        Error: {error}
      </div>
    );

  return (
    <div>
      <Header />
      <TableContainer
        component={Paper}
        className="shadow-md rounded-lg mt-20"
        style={{
          maxHeight: "570px",
          overflowY: "auto",
          overflowX: isMobile ? "auto" : "hidden", // Enable horizontal scrolling for mobile
        }}
      >
        {Array.isArray(requests) && requests.length > 0 ? (
          <Table>
            <TableHead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#E0E0E0",
                zIndex: 2,
              }}
            >
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Request ID</TableCell>
                {!isMobile && <TableCell>Request Type</TableCell>} {/* Hide on mobile */}
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                {!isMobile && <TableCell>Payment Method</TableCell>} {/* Hide on mobile */}
                {!isMobile && <TableCell>Created At</TableCell>} {/* Hide on mobile */}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) =>
                request.initial_payments?.map((payment) => (
                  <TableRow key={payment.initial_payment_id}>
                    <TableCell>{payment.initial_payment_id}</TableCell>
                    <TableCell>{payment.request_id}</TableCell>
                    {!isMobile && <TableCell>{request.request_type}</TableCell>}
                    <TableCell>
                      Php {parseFloat(payment.amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-white ${
                          payment.status === "completed"
                            ? "bg-green-500"
                            : payment.status === "initiated"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>{payment.payment_method || "N/A"}</TableCell>
                    )}
                    {!isMobile && (
                      <TableCell>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </TableCell>
                    )}
                    {user?.role.rolename === "User" &&
                      payment.status !== "completed" &&
                      payment.status !== "refunded" &&
                      payment.status !== "pending" && (
                        <TableCell className="text-right">
                          <Button
                            variant="contained"
                            color="primary"
                            size={isMobile ? "small" : "medium"} // Smaller buttons for mobile
                            onClick={() => handlePayment(payment.request_id)}
                          >
                            Pay 80%
                          </Button>
                        </TableCell>
                      )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-64">
            <Typography variant="h6" className="text-gray-500">
              No data available yet
            </Typography>
          </div>
        )}
      </TableContainer>
    </div>
  );
};

export default PaymentsTable;