"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  Server,
  Cpu,
  Database,
  Cloud,
  GitBranch,
  FileCode,
  Shield,
  Key,
  User,
  Users,
  Settings,
  Wrench,
  Layers,
  Activity,
  Bell,
  Folder,
  Box,
  Terminal,
  Zap,
  Globe,
  ChartLine,
  Bug,
  Palette,
  Lock,
  Cog,
  ChevronDown,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavbarConfig } from "@/types/navbar";
import { signOut, useSession } from "next-auth/react";

const navItems: NavbarConfig = [
  {
    section: "Overview",
    items: [
      {
        label: "Dashboard",
        icon: <Home className="h-4 w-4" />,
        href: "/dashboard",
        subtitle: "System summary and analytics",
        badge: "new",
      },
      {
        label: "Activity",
        icon: <Activity className="h-4 w-4" />,
        href: "/activity",
        subtitle: "Recent system events",
      },
      {
        label: "Notifications",
        icon: <Bell className="h-4 w-4" />,
        href: "/notifications",
        badge: "12",
      },
    ],
  },
  {
    section: "Infrastructure",
    items: [
      {
        label: "Servers",
        icon: <Server className="h-4 w-4" />,
        href: "/servers",
        subtitle: "Deployed instances and resources",
        children: [
          { label: "Production", icon: <Cloud className="h-4 w-4" />, href: "/servers/production" },
          { label: "Staging", icon: <Cloud className="h-4 w-4" />, href: "/servers/staging" },
          { label: "Local", icon: <Terminal className="h-4 w-4" />, href: "/servers/local" },
        ],
      },
      {
        label: "Databases",
        icon: <Database className="h-4 w-4" />,
        href: "/databases",
        children: [
          { label: "PostgreSQL", icon: <Database className="h-4 w-4" />, href: "/databases/postgres" },
          { label: "Redis Cache", icon: <Zap className="h-4 w-4" />, href: "/databases/redis" },
        ],
      },
      {
        label: "Networking",
        icon: <Globe className="h-4 w-4" />,
        href: "/networking",
      },
    ],
  },
  {
    section: "Development",
    role: "USER",
    items: [
      {
        label: "Projects",
        icon: <Folder className="h-4 w-4" />,
        href: "/projects",
        subtitle: "Source-managed repositories",
        children: [
          { label: "Frontend", icon: <FileCode className="h-4 w-4" />, href: "/projects/frontend" },
          { label: "Backend", icon: <Cpu className="h-4 w-4" />, href: "/projects/backend" },
          { label: "Infrastructure", icon: <Layers className="h-4 w-4" />, href: "/projects/infrastructure" },
        ],
      },
      {
        label: "CI/CD Pipelines",
        icon: <GitBranch className="h-4 w-4" />,
        href: "/ci-cd",
        badge: "running",
      },
      {
        label: "Logs",
        icon: <Terminal className="h-4 w-4" />,
        href: "/logs",
      },
      {
        label: "Error Tracking",
        icon: <Bug className="h-4 w-4" />,
        href: "/errors",
        badge: "3",
      },
    ],
  },
  {
    section: "Security",
    items: [
      {
        label: "Users",
        icon: <Users className="h-4 w-4" />,
        href: "/users",
        children: [
          { label: "Roles", icon: <Shield className="h-4 w-4" />, href: "/users/roles" },
          { label: "Permissions", icon: <Key className="h-4 w-4" />, href: "/users/permissions" },
        ],
      },
      {
        label: "API Keys",
        icon: <Lock className="h-4 w-4" />,
        href: "/api-keys",
        subtitle: "Manage access tokens and scopes",
      },
      {
        label: "Audit Logs",
        icon: <FileCode className="h-4 w-4" />,
        href: "/audit",
      },
    ],
  },
  {
    section: "Administration",
    items: [
      {
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
        href: "/settings",
        children: [
          { label: "General", icon: <Cog className="h-4 w-4" />, href: "/settings/general" },
          { label: "Appearance", icon: <Palette className="h-4 w-4" />, href: "/settings/appearance" },
          { label: "System", icon: <Wrench className="h-4 w-4" />, href: "/settings/system", role: "USER" },
        ],
      },
      {
        label: "Integrations",
        icon: <Box className="h-4 w-4" />,
        href: "/integrations",
        subtitle: "External APIs and tools",
      },
      {
        label: "Usage Reports",
        icon: <ChartLine className="h-4 w-4" />,
        href: "/reports",
      },
    ],
  },
];

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const { data: session, status } = useSession();
  const userRole = session?.user?.role;
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newOpenState: Record<string, boolean> = {};
    navItems.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const uniqueKey = `${section.section}-${item.label}`;
          const isChildActive = item.children.some((child) =>
            pathname === child.href || pathname.startsWith(child.href + "/")
          );
          if (isChildActive) newOpenState[uniqueKey] = true;
        }
      });
    });
    setOpenSubmenus(newOpenState);
  }, [pathname]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleSubmenu = (key: string) =>
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));

  const SidebarContent = () => (
    <div className="flex flex-col h-full w-72 border-r border-border bg-linear-to-b from-[var(--sidebar)] to-[var(--background)]">
      <Link href="/home">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-border">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="font-bold text-lg text-primary">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </span>
          <span className="text-xs text-foreground/60">
            v{process.env.NEXT_PUBLIC_APP_VERSION}
          </span>
        </div>
      </Link>

      {status === "authenticated" && userRole && (
        <div className="flex-1 overflow-y-auto py-4">
          {navItems.filter((item) => {
            if (item.role) {
              return userRole == item.role;
            }

            return true;
          }).map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-6 px-6">
              <h3 className="text-xs font-semibold text-foreground/60 uppercase mb-3">
                {section.section}
              </h3>
              <ul className="space-y-1">
                {section.items?.filter((items) => {
                  if (items.role) {
                    return userRole == items.role;
                  }

                  return true;
                }).map((item, itemIdx) => {
                  const isActive = pathname === item.href;
                  const hasChildren = !!item.children;
                  const uniqueKey = `${section.section}-${item.label}`;
                  const isSubmenuOpen = openSubmenus[uniqueKey] || false;

                  return (
                    <li key={itemIdx}>
                      <div className="relative">
                        <Link
                          href={item.href}
                          scroll={false}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                            }`}
                          onClick={(e) => {
                            if (hasChildren) {
                              e.preventDefault();
                              toggleSubmenu(uniqueKey);
                            } else if (pathname === item.href) e.preventDefault();
                          }}
                        >
                          <span
                            className={`h-4 w-4 ${isActive ? "text-primary" : "text-foreground/60"
                              }`}
                          >
                            {item.icon}
                          </span>
                          <span className="flex-1">{item.label}</span>
                          {item.subtitle && (
                            <span className="text-xs text-foreground/50 truncate max-w-[100px]">
                              {item.subtitle}
                            </span>
                          )}
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          {hasChildren &&
                            (isSubmenuOpen ? (
                              <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 rotate-180 ${isActive ? "text-primary" : "text-foreground/60"
                                  }`}
                              />
                            ) : (
                              <ArrowRight
                                className={`h-4 w-4 transition-colors ${isActive ? "text-primary" : "text-foreground/60"
                                  }`}
                              />
                            ))}
                        </Link>

                        {hasChildren && (
                          <ul
                            className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-200 ease-in-out ${isSubmenuOpen
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0 pointer-events-none"
                              }`}
                          >
                            {item.children
                              ?.filter((child) => {
                                if (child.role) {
                                  return userRole == child.role;
                                }

                                return true;
                              })
                              .map((child, childIdx) => {
                                const childIsActive = pathname === child.href;
                                return (
                                  <li key={childIdx}>
                                    <Link
                                      href={child.href}
                                      scroll={false}
                                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${childIsActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                                        }`}
                                    >
                                      <span
                                        className={`h-4 w-4 ${childIsActive
                                          ? "text-primary"
                                          : "text-foreground/60"
                                          }`}
                                      >
                                        {child.icon}
                                      </span>
                                      <span className="flex-1">{child.label}</span>
                                    </Link>
                                  </li>
                                );
                              })}
                          </ul>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {status === "authenticated" && (
        <div className="border-t border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image ?? ""} alt="User" />
                <AvatarFallback className="bg-muted text-foreground">
                  {session.user.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {session.user.name}
                </div>
                <div className="text-xs text-foreground/60">{session.user.email.length > 20
                  ? session.user.email.slice(0, 20) + "..."
                  : session.user.email}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground/60 hover:text-foreground"
              onClick={async () => await signOut()}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  if (!isMobile) return <SidebarContent />;

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
          ☰
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}
