import localFont from "next/font/local";
import "./globals.css";

import { UsuarioProvider } from "@/context/usuarioProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Libro Obra",
  description: "Interfaz principal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        id="__next"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UsuarioProvider>
          {children}
        </UsuarioProvider>
      </body>
    </html>
  );
}
