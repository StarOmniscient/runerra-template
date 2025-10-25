// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider, useTheme } from "next-themes";
import { ReactNode, useEffect } from "react";
import { THEMES } from "./themes";
import type { UserTheme } from "@/types/usertheme";


function UserThemeInjector() {
  const { theme } = useTheme();

  useEffect(() => {
    const userThemes = JSON.parse(localStorage.getItem("user-themes") || "[]") as UserTheme[];

    // Inject all user themes
    userThemes.forEach((userTheme) => {
      const match = userTheme.css.match(/\.([^\s{]+)/);
      if (!match) return;

      const className = match[1];
      const styleId = `user-theme-${className}`;

      // Avoid duplicate injection
      if (document.getElementById(styleId)) return;

      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = userTheme.css;
      document.head.appendChild(style);
    });

    // Optional: if current theme is a user theme, ensure it's applied
    // (this is usually handled by next-themes via `attribute="class"`)
  }, []);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const allThemeKeys = [
    ...THEMES.map(t => t.key),
    // We don't know user theme keys at build time, so we allow any string
    // next-themes will accept any theme name not in the list if `disableTransition` or similar is used,
    // but to be safe, we can omit explicit user keys here and rely on runtime injection.
  ];

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        themes={allThemeKeys}
      >
        {children}
        <UserThemeInjector />
      </ThemeProvider>
    </SessionProvider>
  );
}