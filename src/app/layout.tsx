// app/layout.tsx
"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import darkTheme from "@/lib/theme"; // ajuste esse caminho se necessário
import "./globals.css"; // se estiver usando Tailwind ou CSS global

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#121212",
        }}
      >
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <div
            style={{
              width: "100%",
              maxWidth: "100%",
              padding: "2rem",
              backgroundColor: "#1e1e1e",
              borderRadius: "12px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          >
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
