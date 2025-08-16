"use client";
import React, { useState, useEffect, useRef } from "react";

const WebSocketChat: React.FC = () => {
  const serverUrl = "wss://cashpay.my.id:2358/ws"; 
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);

  const addLog = (text: string) => {
    setLogs((prev) => [...prev, text]);
  };

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

    // cleanup saat komponen unmount
    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "monospace",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
        💬 WebSocket Chat
      </h2>

      {/* Message Input */}
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

      {/* Status */}
      <div
        style={{
          marginBottom: "10px",
          color: isConnected ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        Status: {isConnected ? "Connected ✅" : "Disconnected ❌"}
      </div>

      {/* Logs */}
      <div
        style={{
          border: "1px solid gray",
          padding: "10px",
          height: "300px",
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
  );
};

export default WebSocketChat;
