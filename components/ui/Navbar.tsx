"use client";

import React from "react";
import Link from "next/link";
import { Sparkle, Map, MessageSquare, Shield } from "lucide-react";
import ThemeToggle from "../Theme-toggle";
import { SignUpButton, UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { isSignedIn, user } = useUser();

  // ✅ Extract role safely
  const role = user?.publicMetadata?.role as string | undefined;
  console.log("Navbar rendered");
  console.log(role);
  const isAdmin = role === "ADMIN";

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex h-24 items-center justify-between px-4">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-6">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-linear-to-r from-blue-500 to-violet-500 flex items-center justify-center">
                <Sparkle className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold">Your Opinion Matters</span>
            </div>
          </Link>

          <Link
            href="/roadmap"
            className="text-sm hover:text-primary flex items-center gap-1"
          >
            <Map className="h-4 w-4" /> Roadmap
          </Link>

          <Link
            href="/feedback"
            className="text-sm hover:text-primary flex items-center gap-1"
          >
            <MessageSquare className="h-4 w-4" /> Feedback
          </Link>

          {/* ✅ ADMIN ONLY */}
          {isSignedIn && isAdmin && (
            <Link
              href="/admin"
              className="text-sm hover:text-primary transition-colors flex items-center gap-1"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* ❌ Not signed in */}
          {!isSignedIn && (
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          )}

          {/* ✅ Signed in */}
          {isSignedIn && <UserButton />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
