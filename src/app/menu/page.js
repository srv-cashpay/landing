"use client";  // karena kita pakai hook di komponen client

import React from "react";
import { useSearchParams } from "next/navigation";

const menuData = {
  greetinc: [
    { id: 1, name: "Nasi Goreng", price: 15000 },
    { id: 2, name: "Mie Ayam", price: 12000 },
  ],
  warung123: [
    { id: 3, name: "Sate Ayam", price: 20000 },
    { id: 4, name: "Bakso", price: 13000 },
  ],
};

const MenuMakan = () => {
  const searchParams = useSearchParams();
  const merchant = searchParams.get("merchant");

  const menu = menuData[merchant] || [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Menu {merchant || "Tidak Diketahui"}</h1>
      {menu.length === 0 ? (
        <p>Tidak ada menu untuk merchant ini.</p>
      ) : (
        <div style={styles.grid}>
          {menu.map((item) => (
            <div key={item.id} style={styles.card}>
              <h2>{item.name}</h2>
              <p>Harga: Rp {item.price.toLocaleString()}</p>
              <button style={styles.button}>Pesan</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default MenuMakan;
