import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Digital Heroes | Golf Performance & Monthly Charity Draws",
  description: "Transform your verified golf rounds into monthly prize pool draws while funding grassroots charities with transparent financial ledgers. No clichés, pure performance and real impact.",
  keywords: ["golf", "charity", "prize draw", "stableford", "fintech", "philanthropy"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1A1A2E] antialiased"
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');localStorage.removeItem('dh_theme');}catch(e){}`,
          }}
        />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
