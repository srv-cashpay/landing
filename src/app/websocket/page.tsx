"use client";
import React, { useState, useEffect, useRef } from "react";

const ChatAndPush: React.FC = () => {
  // =========================
  // WEBSOCKET CHAT
  // =========================
  const serverUrl = "wss://cashpay.my.id:2358/ws";
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  const addLog = (text: string) => setLogs((prev) => [...prev, text]);

  const sendMessage = () => {
    if (!isConnected || !wsRef.current) {
      addLog("⚠️ Error: WebSocket not connected");
      return;
    }
    wsRef.current.send(message);
    addLog(`📝 You: ${message}`);
    setMessage("");
  };

  useEffect(() => {
    addLog(`🔌 Connecting to ${serverUrl}...`);
    const ws = new WebSocket(serverUrl);

    ws.onopen = () => {
      setIsConnected(true);
      addLog("✅ Connected");
    };
    ws.onmessage = (event) => {
      addLog(`📩 Server: ${event.data}`);
    };
    ws.onclose = () => {
      setIsConnected(false);
      addLog("❌ Disconnected");
    };
    ws.onerror = (err) => {
      addLog(`⚠️ Error: ${JSON.stringify(err)}`);
    };

    wsRef.current = ws;
    return () => ws.close();
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // =========================
  // FCM SEND
  // =========================
  const [fcmToken, setFcmToken] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pushLog, setPushLog] = useState("");

  const sendPush = async () => {
    try {
      const res = await fetch("https://cashpay.my.id:2358/fcm/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: fcmToken, title, body }),
      });
      const data = await res.json();
      setPushLog(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setPushLog(`Error: ${err.message}`);
    }
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "monospace",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
        💬 WebSocket Chat + 📲 Push Sender
      </h1>

      {/* CHAT */}
      <div style={{ marginBottom: "40px" }}>
        <h2>💬 Chat</h2>
        <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid gray",
              borderRadius: "4px",
            }}
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            disabled={!isConnected}
            style={{
              backgroundColor: isConnected ? "#2196F3" : "#aaa",
              color: "white",
              padding: "8px 14px",
              border: "none",
              borderRadius: "4px",
              cursor: isConnected ? "pointer" : "not-allowed",
            }}
          >
            Send
          </button>
        </div>

        <div
          style={{
            marginBottom: "10px",
            color: isConnected ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          Status: {isConnected ? "Connected ✅" : "Disconnected ❌"}
        </div>

        <div
          style={{
            border: "1px solid gray",
            padding: "10px",
            height: "250px",
            overflowY: "auto",
            backgroundColor: "#1e1e1e",
            color: "#0f0",
            fontSize: "14px",
            borderRadius: "4px",
          }}
        >
          {logs.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>

      {/* PUSH */}
      <div>
        <h2>📲 Send Push Notification</h2>
        <input
          placeholder="FCM Device Token"
          value={fcmToken}
          onChange={(e) => setFcmToken(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 8,
            border: "1px solid gray",
            borderRadius: 4,
          }}
        />
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 8,
            border: "1px solid gray",
            borderRadius: 4,
          }}
        />
        <input
          placeholder="Message Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 10,
            padding: 8,
            border: "1px solid gray",
            borderRadius: 4,
          }}
        />
        <button
          onClick={sendPush}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🚀 Send Push
        </button>

        <pre
          style={{
            marginTop: 20,
            background: "#111",
            color: "#0f0",
            padding: 10,
            height: "200px",
            overflow: "auto",
          }}
        >
          {pushLog}
        </pre>
      </div>
    </div>
  );
};

export default ChatAndPush;
