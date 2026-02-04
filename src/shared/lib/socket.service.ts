import { io, Socket } from "socket.io-client";

class SocketService {
  public socket: Socket | null = null;
  private lastToken: string | null = null;

  private normalizeToken(raw: string) {
    let t = raw.trim();
    if (t.startsWith("Bearer ")) t = t.slice(7).trim();
    if (
      (t.startsWith('"') && t.endsWith('"')) ||
      (t.startsWith("'") && t.endsWith("'"))
    ) {
      t = t.slice(1, -1);
    }
    return t;
  }

  connect(rawToken: string) {
    if (!rawToken) {
      console.warn("Socket connect: token yo‘q, ulanmayman");
      return;
    }

    const token = this.normalizeToken(rawToken);

    // Token o‘zgarmagan + socket ulangan -> qayta ulamaymiz
    if (this.socket?.connected && this.lastToken === token) return;

    // Token o‘zgargan yoki socket yo‘q -> reconnect
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.lastToken = token;

    this.socket = io("http://localhost:2026", {
      auth: { token },               // <<< MUHIM
      transports: ["websocket", "polling"],
      forceNew: true,                // <<< MUHIM: yangi handshake
      reconnection: true,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("Socket ulandi ✅ ID:", this.socket?.id);
    });

    this.socket.on("connect_error", (err) => {
      console.error("Socket ulanishda xato ❌:", err.message);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket uzildi 🔌 reason:", reason);
    });

    return this.socket;
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.lastToken = null;
      console.log("Socket uzildi 🔌");
    }
  }
}

export const socketService = new SocketService();
