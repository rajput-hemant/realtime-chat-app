import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

import "@/styles/globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: "600" });

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-black/90 text-white antialiased",
          poppins.className
        )}
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
