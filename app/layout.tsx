import type { Metadata } from "next";
import "./globals.css";
import SidebarWrapper from "./components/SidebarWrapper";
import ThemeProvider from "./components/ThemeProvider";
import AIChatWidget from "./components/AIChatWidget";

export const metadata: Metadata = {
  title: "Healthcare Analytics",
  description: "City General Hospital Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SidebarWrapper>{children}</SidebarWrapper>
          <AIChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}