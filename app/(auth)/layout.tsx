import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { RedirectToSignIn } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Azera Motors admin",
  description: "Admin dashboard to manage Azera Motors",
  icons: {
    icon: '/favicon.ico', // /public path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <ClerkProvider
    publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    signInFallbackRedirectUrl="/"
    signUpFallbackRedirectUrl="/"
  >
    <SignedIn>
  
    <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>

    </SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </ClerkProvider>


  );
}

