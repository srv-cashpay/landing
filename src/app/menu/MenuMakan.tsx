"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type Product = {
  id: string;
  product_name: string;
  price: number;
  image_url: string | null;
};

const MenuMakan: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const merchantId = "fcb0a976-d3b8-4534-9eb8-12c2a7594b08";
        const response = await axios.get(`https://cashpay.my.id:2360/menu?merchant_id=${merchantId}`);
        
        if (response.data?.success) {
          const rows = response.data.data?.rows || [];
          const data = rows.map((row: any) => ({
            id: row.id,
            product_name: row.product_name,
            price: row.price,
            image_url: row.image ? `https://cashpay.my.id:2358/${row.image.file_path}` : null
          }));
          setProducts(data);
        } else {
          alert(response.data.message || "Gagal mendapatkan produk");
        }
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Daftar Produk</h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>Tidak ada produk ditemukan</p>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product.id} style={styles.card}>
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt={product.product_name}
                  style={styles.image}
                />
              )}
              <h2>{product.product_name}</h2>
              <p>Harga: Rp {product.price.toLocaleString()}</p>
              <button style={styles.button}>Pesan</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
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
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "10px",
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
