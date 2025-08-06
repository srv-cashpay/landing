'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    if (email === 'admin@example.com' && password === '123456') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Email atau password salah.');
    }
  };

  const handleLogout = () => {
    setEmail('');
    setPassword('');
    setIsLoggedIn(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {isLoggedIn ? (
          <>
            <h2 style={styles.title}>Selamat Datang 👋</h2>
            <p style={styles.subtext}>{email}</p>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtext}>Gunakan email dan password yang valid</p>
           <form onSubmit={handleSubmit} style={styles.form}>
  <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e: ChangeEvent<HTMLInputElement>) =>
      setEmail(e.target.value)
    }
    style={styles.input}
  />

  {/* Tampilkan password hanya jika email mengandung '@' */}
  {email.includes('@') && (
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value)
      }
      style={styles.input}
    />
  )}

  {error && <p style={styles.error}>{error}</p>}
  <button
  type="submit"
  style={{
    ...styles.button,
    backgroundColor: password.length >= 8 ? '#000000' : '#999999',
    cursor: password.length >= 8 ? 'pointer' : 'not-allowed',
  }}
  disabled={password.length < 8}
>
  Continue
</button>

</form>

          </>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to left, #6e6e6eff, #ffffff)',
    padding: '20px',
  },
  card: {
    background: '#ffffff',  
    borderRadius: '12px',
    padding: '40px 30px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '8px',
    fontSize: '24px',
    fontWeight: 600,
    color: '#333',
  },
  subtext: {
    marginBottom: '24px',
    color: '#666',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#000000',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  logoutButton: {
    marginTop: '24px',
    padding: '12px',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    color: '#ef4444',
    fontSize: '14px',
    textAlign: 'left',
    marginTop: '-10px',
    marginBottom: '5px',
  },
};

export default LoginPage;
