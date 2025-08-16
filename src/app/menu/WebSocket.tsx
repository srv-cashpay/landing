import React, { useState, useEffect, useRef } from "react";

const WebSocketChat: React.FC = () => {
  const [serverUrl, setServerUrl] = useState<string>("wss://cashpay.my.id:2358/ws");
  const [message, setMessage] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Bersihkan koneksi saat komponen unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const connect = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      addLog("[Info] Already connected");
      return;
    }

    const ws = new WebSocket(serverUrl);

    ws.onopen = () => {
      addLog("[Connected]");
    };

    ws.onmessage = (event: MessageEvent) => {
      addLog(`[Server] ${event.data}`);
    };

    ws.onclose = () => {
      addLog("[Disconnected]");
    };

    ws.onerror = (err: Event) => {
      addLog(`[Error] ${JSON.stringify(err)}`);
    };

    wsRef.current = ws;
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const sendMessage = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
      addLog(`[You] ${message}`);
      setMessage("");
    } else {
      addLog("[Error] WebSocket not connected");
    }
  };

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>WebSocket Client (React + TS)</h2>
      <input
        type="text"
        value={serverUrl}
        onChange={(e) => setServerUrl(e.target.value)}
        style={{ width: "80%" }}
      />
      <div style={{ marginTop: 10 }}>
        <button onClick={connect}>Connect</button>
        <button onClick={disconnect}>Disconnect</button>
      </div>

      <h3>Messages</h3>
      <div
        style={{
          border: "1px solid #ccc",
          height: 200,
          overflowY: "auto",
          padding: 10,
          marginTop: 5,
        }}
      >
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          value={message}
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: "70%" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default WebSocketChat;
