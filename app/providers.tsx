// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { THEMES } from "./themes";



export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        themes={THEMES.map(t => t.key)} // ← list your themes
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}