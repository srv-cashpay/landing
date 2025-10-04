"use client";

import React, { useState } from "react";

export default function VoucherVerification({ verifyEndpoint = null }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // simple client-side validation
  function validateCode(input) {
    const trimmed = input.trim();
    if (!trimmed) return "Kode voucher tidak boleh kosong.";
    if (trimmed.length < 4) return "Kode terlalu pendek.";
    return "";
  }

  // replace or adapt this with an actual API call
  async function verifyVoucherMock(voucherCode) {
    // simulate network latency
    await new Promise((r) => setTimeout(r, 900));

    // mock responses
    const validCodes = {
      VCR100: { amount: 50000, currency: "IDR", status: "valid", note: "Voucher sudah aktif" },
      VCR200: { amount: 100000, currency: "IDR", status: "valid", note: "Voucher berlaku sampai 2025-12-31" },
      EXPIRED: { amount: 0, currency: "IDR", status: "expired", note: "Voucher sudah kadaluarsa" },
    };

    const upper = voucherCode.toUpperCase();
    if (validCodes[upper]) return { ok: true, data: validCodes[upper] };
    if (upper.startsWith("ERR")) return { ok: false, code: 400, message: "Format voucher salah" };

    // not found
    return { ok: false, code: 404, message: "Voucher tidak ditemukan" };
  }

  async function handleVerify(e) {
    e && e.preventDefault();
    setError("");
    setResult(null);

    const vErr = validateCode(code);
    if (vErr) {
      setError(vErr);
      return;
    }

    setLoading(true);
    try {
      let res;
      if (verifyEndpoint) {
        // real fetch to back-end (JSON expected). Caller must provide verifyEndpoint.
        const r = await fetch(verifyEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ voucher: code.trim() }),
        });
        if (!r.ok) throw new Error(`Server mengembalikan status ${r.status}`);
        res = await r.json();
        // assume backend returns { ok: true, data: {...} } or { ok:false, message }
      } else {
        // mock
        res = await verifyVoucherMock(code.trim());
      }

      if (res.ok) {
        setResult(res.data);
      } else {
        setError(res.message || "Terjadi kesalahan saat verifikasi.");
      }
    } catch (err) {
      setError(err.message || "Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setCode("");
    setError("");
    setResult(null);
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Verifikasi Voucher</h2>
      <p className="text-sm text-gray-500 mb-4">Masukkan kode voucher untuk melihat status dan nilai.
      </p>

      <form onSubmit={handleVerify} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">Kode Voucher</span>
          <input
            aria-label="Kode Voucher"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="mis. VCR100"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            disabled={loading}
          />
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            className={`inline-flex items-center justify-center px-4 py-2 rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 flex-1 ${loading ? "opacity-80 cursor-wait" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Memeriksa...
              </>
            ) : (
              "Verifikasi"
            )}
          </button>

          <button
            type="button"
            onClick={clearForm}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm flex-1"
            disabled={loading}
          >
            Bersihkan
          </button>
        </div>
      </form>

      <div className="mt-4 min-h-[72px]">
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            <strong className="font-medium">Kesalahan: </strong>
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="rounded-md bg-green-50 border border-green-200 p-4 text-sm text-green-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Status: <span className="uppercase">{result.status}</span></div>
                <div className="mt-1 text-xs text-gray-700">{result.note}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{result.amount ? result.amount.toLocaleString() : 0} {result.currency || "IDR"}</div>
                <div className="text-xs text-gray-600">Nilai Voucher</div>
              </div>
            </div>

            {/* additional details */}
            <div className="mt-3 text-xs text-gray-600">
              <div><strong>Kode:</strong> {code.toUpperCase()}</div>
            </div>
          </div>
        )}

        {!error && !result && (
          <div className="text-sm text-gray-400">Belum ada verifikasi. Masukkan kode di atas lalu tekan "Verifikasi".</div>
        )}
      </div>

      <hr className="my-4" />

      <div className="text-xs text-gray-500">
        <strong>Catatan:</strong>
        <ul className="list-disc ml-5 mt-1">
          <li>Kode tidak sensitif huruf besar/kecil.</li>
          <li>Ganti <code>verifyEndpoint</code> prop untuk menghubungkan ke API backend Anda.</li>
          <li>Komponen sudah responsif dan aksesibel (aria-label untuk input).</li>
        </ul>
      </div>
    </div>
  );
}
