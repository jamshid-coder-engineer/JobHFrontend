import Providers from "./providers"; 
import "./global.css";
import { Header } from "../widgets/header/ui/header";
import { NotificationHandler } from "../widgets/notifications/notification-handler";
import { Toaster } from "../shared/ui/sonner"; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body className="antialiased">
        {}
        <Providers>
          <Header />
          <NotificationHandler />
          <Toaster />
          <main>{children}</main>
          {}
        </Providers>
      </body>
    </html>
  );
}