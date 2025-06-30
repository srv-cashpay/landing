"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

type ApiRow = {
  id: string;
  product_name: string;
  price: number;
  image: {
    file_path: string;
  } | null;
};

type Product = {
  id: string;
  product_name: string;
  price: number;
  image_url: string | null;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const MenuMakan: React.FC = () => {
  const searchParams = useSearchParams();
  const merchantId = searchParams.get("merchant_id");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [namaPemesan, setNamaPemesan] = useState<string>("");

const handleSelesai = async () => {
  if (!merchantId) {
    alert("Merchant ID tidak ditemukan");
    return;
  }

  const orderPayload = {
    order_name: namaPemesan,
    product: cart.map((item) => ({
      product_name: item.product.product_name,
      price: item.product.price,
      quantity: item.quantity,
    })),
  };

  try {
    const response = await axios.post(
      `https://cashpay.my.id:2358/menu/order?merchant_id=${merchantId}`,
      orderPayload
    );

    if (response.data?.status === true) {
      alert(response.data.message || `Pesanan atas nama: ${namaPemesan} berhasil disimpan.`);
      setCart([]);
      setNamaPemesan("");
      setShowCart(false);
    } else {
      alert(response.data.message || "Gagal memproses pesanan");
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      alert(err.message || "Terjadi kesalahan saat memesan");
    } else {
      console.error(err);
      alert("Terjadi kesalahan tidak terduga");
    }
  }
};

  useEffect(() => {
    if (!merchantId) {
      alert("Merchant ID tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`https://cashpay.my.id:2360/menu?merchant_id=${merchantId}`);
        if (response.data?.success) {
          const rows: ApiRow[] = response.data.data?.rows || [];
          const data: Product[] = rows.map((row) => ({
            id: row.id,
            product_name: row.product_name,
            price: row.price,
            image_url: row.image ? `https://cashpay.my.id:2358/${row.image.file_path}` : null,
          }));
          setProducts(data);
        } else {
          alert(response.data.message || "Gagal mendapatkan produk");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          alert(err.message || "Terjadi kesalahan");
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [merchantId]);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (productId: string) => {
  setCart((prevCart) => prevCart.filter(item => item.product.id !== productId));
};

 

  const isSelesaiDisabled = cart.length === 0 || namaPemesan.trim() === "";

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
                <Image
                  src={product.image_url}
                  alt={product.product_name}
                  width={300}
                  height={180}
                  style={styles.image}
                />
              )}
              <h2>{product.product_name}</h2>
              <p>Harga: Rp {product.price.toLocaleString()}</p>
              <button style={styles.button} onClick={() => handleAddToCart(product)}>
                Pesan
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Footer button */}
      <div style={styles.footer}>
        <button style={styles.cartButton} onClick={() => setShowCart(true)}>
          Lihat Keranjang ({cart.reduce((acc, item) => acc + item.quantity, 0)})
        </button>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Keranjang</h2>
            {cart.length === 0 ? (
              <p>Keranjang kosong</p>
            ) : (
              <>
                <ul style={{ listStyle: "none", padding: 0 }}>
                 {cart.map((item) => (
                <li key={item.product.id} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    {item.product.product_name} - {item.quantity}x (Rp {item.product.price.toLocaleString()})
                  </span>
                  <button
                    onClick={() => handleRemoveFromCart(item.product.id)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      cursor: 'pointer',
                      marginLeft: '8px'
                    }}
                  >
                    Hapus
                  </button>
                </li>
              ))}
                </ul>
                <div style={{ margin: "10px 0" }}>
                  <input
                    type="text"
                    placeholder="Atas nama siapa?"
                    value={namaPemesan}
                    onChange={(e) => setNamaPemesan(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </>
            )}
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button style={styles.closeButton} onClick={() => setShowCart(false)}>Tutup</button>
              <button
                style={{
                  ...styles.finishButton,
                  backgroundColor: isSelesaiDisabled ? "#ccc" : "#4CAF50",
                  cursor: isSelesaiDisabled ? "not-allowed" : "pointer",
                }}
                onClick={handleSelesai}
                disabled={isSelesaiDisabled}
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    position: "relative",
    minHeight: "100vh",
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
    borderRadius: "6px",
    marginBottom: "10px",
    objectFit: "cover",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  footer: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#f8f8f8",
    padding: "10px",
    borderTop: "1px solid #ddd",
    textAlign: "center",
  },
  cartButton: {
    backgroundColor: "#2196F3",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "400px",
  },
  closeButton: {
    backgroundColor: "#aaa",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    marginRight: "10px",
  },
  finishButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
};

export default MenuMakan;
