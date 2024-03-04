import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "../components/providers/theme-provider";
import { cn } from "@/lib/utils";
import "./globals.css";
import ModalProvider from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import QueryProvider from "@/components/providers/query-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Discord Clone",
  description: "Discord Clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="discord-theme"
          >
            <ModalProvider />
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
