"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  const routes = [
    { title: "Strona główna", path: "/" },
    { title: "Quizy", path: "/quizy" },
    { title: "Anti-Phishing", path: "/phishing" },
    { title: "Nauka silnych haseł", path: "/password-game" },
    { title: "Materiały", path: "/educational_materials" },
    { title: "O projekcie", path: "/about" },
  ];

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              </svg>
              <span className="font-bold text-xl">SAFER IN WEB</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {route.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <SignedOut>
                <div className="flex gap-2">
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm">
                      Zaloguj się
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button size="sm">Zarejestruj się</Button>
                  </SignUpButton>
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      className="text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {route.title}
                    </Link>
                  ))}
                  <SignedOut>
                    <div className="flex flex-col gap-2 mt-4">
                      <SignInButton mode="modal">
                        <Button variant="outline" className="w-full">
                          Zaloguj się
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button className="w-full">Zarejestruj się</Button>
                      </SignUpButton>
                    </div>
                  </SignedOut>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
