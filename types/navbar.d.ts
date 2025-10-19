import { ReactNode } from "react";


type UserRole = "ADMIN" | "USER" | "MODERATOR"; // Add other roles as needed

export interface NavChildItem {
  label: string;
  icon: ReactNode;
  href: string;
  role?: UserRole; // Add role to child items
}

export interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  subtitle?: string;
  badge?: string;
  children?: NavChildItem[]; // Array of NavChildItem
  role?: UserRole; // Add role to main items
}

export interface NavSection {
  section: string;
  items: NavItem[]; // Array of NavItem
  role?: UserRole; // Add role to sections
}

// Optional: if you want to enforce the full structure
export type NavbarConfig = NavSection[];