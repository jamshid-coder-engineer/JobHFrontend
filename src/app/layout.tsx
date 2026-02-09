import Providers from "./providers"; // 👈 Siz yasagan fayl
import "./global.css";
import { Header } from "../widgets/header/ui/header";
import { NotificationHandler } from "../widgets/notifications/notification-handler";
import { Toaster } from "../shared/ui/sonner"; // Yoki "sonner" kutubxonasidan

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="antialiased">
        {/* 🔥 MUHIM: Providers hamma narsani o'rab turishi shart */}
        <Providers>
          <Header />
          <NotificationHandler />
          <Toaster />
          <main>{children}</main>
          {/* Main ichiga children qo'ygan ma'qul */}
        </Providers>
      </body>
    </html>
  );
}