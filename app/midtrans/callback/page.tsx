"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function PaymentChecklist() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id");
  const statusCode = searchParams.get("status_code");
  const transactionStatus = searchParams.get("transaction_status");

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Info</h2>

      <div className="text-sm text-gray-600 mb-6">
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Status Code:</strong> {statusCode}</p>
        <p><strong>Transaction Status:</strong> {transactionStatus}</p>
      </div>

      <button
        className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        onClick={() => alert("Pembayaran dikonfirmasi!")}
      >
        Konfirmasi Pembayaran
      </button>
    </div>
  );
}
