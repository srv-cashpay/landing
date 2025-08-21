"use client";
import React, { useState } from "react";

const SendPush: React.FC = () => {
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [log, setLog] = useState("");

  const sendPush = async () => {
    try {
      const res = await fetch("https://cashpay.my.id:2358/fcm/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, title, body }),
      });
      const data = await res.json();
      setLog(JSON.stringify(data, null, 2));
    } catch (err) {
      setLog(`Error: ${err}`);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📲 Send Push Notification</h2>
      <input
        placeholder="Device Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        placeholder="Message"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button onClick={sendPush}>🚀 Send Push</button>
      <pre style={{ marginTop: 20, background: "#111", color: "#0f0", padding: 10 }}>
        {log}
      </pre>
    </div>
  );
};

export default SendPush;
