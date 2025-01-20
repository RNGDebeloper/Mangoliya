import type { Metadata } from "next";
import Head from "next/head";
import localFont from "next/font/local";
import { AnalyticsWrapper } from "@/components/ui/analyticsWrapper";
import { ToastContainer } from "react-toastify";
import { HeaderComponent } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";
import { CookieConsent } from "@/components/ui/cookieConsent";
import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "灯 - Akari",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <Head>
                <AnalyticsWrapper />
            </Head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <HeaderComponent />
                    {children}
                    <ToastContainer />
                    <CookieConsent />
                    <Footer />
                </ThemeProvider>
            </body>
        </html>
    );
}
