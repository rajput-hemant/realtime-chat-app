import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

import "@/styles/globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: "600" });

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("antialiased", poppins.className)}>
        <main>{children}</main>

        <Toaster />
      </body>
    </html>
  );
};

export default RootLayout;
