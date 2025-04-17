"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function MidtransCallbackPage() {
  const searchParams = useSearchParams();

  const orderId = searchParams?.get("order_id") || "";
  const statusCode = searchParams?.get("status_code") || "";
  const transactionStatus = searchParams?.get("transaction_status") || "";

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Status Pembayaran</h2>

      <div className="text-sm text-gray-700 space-y-2">
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Status Code:</strong> {statusCode}</p>
        <p><strong>Transaction Status:</strong> {transactionStatus}</p>
      </div>

      <button
        className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={() => alert("Pembayaran dikonfirmasi")}
      >
        Konfirmasi Pembayaran
      </button>
    </div>
  );
}
