"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { BiReceipt } from "react-icons/bi";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 md:h-16 items-center">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-[#1a5c38] to-[#2d8653] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <BiReceipt className="text-white text-base md:text-lg" />
            </div>
            <span className="text-lg md:text-xl font-bold text-[#1a5c38]">BillFast</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/create"
              className="bg-[#1a5c38] text-white px-3 md:px-5 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-base hover:bg-[#2d8653] transition-colors shadow-sm"
            >
              Create Invoice
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-block text-gray-600 hover:text-[#1a5c38] font-medium transition-colors text-sm md:text-base"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-400 hover:text-red-500 font-medium transition-colors text-sm md:text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-[#1a5c38] font-medium transition-colors text-sm md:text-base"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-[#1a5c38] border border-[#1a5c38] px-3 md:px-4 py-1 md:py-1.5 rounded-lg font-medium text-sm md:text-base hover:bg-[#1a5c38] hover:text-white transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
