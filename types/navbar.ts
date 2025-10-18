import { ReactNode } from "react";

export interface NavChildItem {
  label: string;
  icon: ReactNode;
  href: string;
}

export interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  subtitle?: string;
  badge?: string;
  children?: NavChildItem[];
}

export interface NavSection {
  section: string;
  items: NavItem[];
}

// Optional: if you want to enforce the full structure
export type NavbarConfig = NavSection[];