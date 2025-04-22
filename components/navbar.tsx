"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="font-bold">Privacy Report</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/connected"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/connected" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Connected
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="https://github.com/yourusername/fiasco" target="_blank">
              GitHub
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}