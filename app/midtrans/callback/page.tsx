"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentChecklist() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const statusCode = searchParams.get("status_code");
  const transactionStatus = searchParams.get("transaction_status");

  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await fetch("http://103.127.134.78:2358/midtrans/callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            status_code: statusCode,
            transaction_status: transactionStatus,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch payment data");
        }

        const data = await response.json();
        setPaymentData(data);  // Save the data into state
      } catch (err) {
        setError(err.message);  // Handle any errors
      } finally {
        setLoading(false);  // Set loading to false once the fetch is complete
      }
    };

    if (orderId && statusCode && transactionStatus) {
      fetchPaymentData();  // Call the function to fetch payment data
    }
  }, [orderId, statusCode, transactionStatus]);

  const handlePaymentConfirmation = () => {
    alert("Pembayaran dikonfirmasi!");
  };

  if (loading) return <p>Loading...</p>;  // Show loading state
  if (error) return <p>Error: {error}</p>;  // Show error state

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Info</h2>

      <div className="text-sm text-gray-600 mb-6">
        <p><strong>Order ID:</strong> {orderId || paymentData?.order_id}</p>
        <p><strong>Status Code:</strong> {statusCode || paymentData?.status_code}</p>
        <p><strong>Transaction Status:</strong> {transactionStatus || paymentData?.transaction_status}</p>
      </div>

      <button
        className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        onClick={handlePaymentConfirmation}
      >
        Konfirmasi Pembayaran
      </button>
    </div>
  );
}
