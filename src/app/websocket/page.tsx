"use client";

// src/components/Broadcast.tsx
import React, { useState } from "react";

export default function Broadcast() {
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("Cashpay Info");
  const [body, setBody] = useState("Saldo kamu bertambah Rp50.000");
  const [extra, setExtra] = useState("optional");
  const [loading, setLoading] = useState(false);

  const sendBroadcast = async () => {
    setLoading(true);
    try {
      const payload = {
        token,
        notification: {
          title,
          body,
        },
        data: {
          extra,
        },
      };

      const res = await fetch("https://cashpay.my.id:2358/fcm/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Pesan berhasil dikirim!");
      } else {
        const err = await res.text();
        alert("Gagal mengirim: " + err);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl mt-8">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Kirim FCM</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Token
        </label>
        <textarea
          className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
          rows={2}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Masukkan FCM device token"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Judul
        </label>
        <input
          className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Judul notifikasi"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Pesan
        </label>
        <textarea
          className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
          rows={2}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Isi pesan notifikasi"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Extra (opsional)
        </label>
        <input
          className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="Tambahan data"
        />
      </div>

      <button
        onClick={sendBroadcast}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </div>
  );
}
