
import React from "react";
import { SignInButton } from "@clerk/react";
import { Button } from "@heroui/react";
import {
  MessageCircle,
  ArrowUpRight,
  LockKeyhole,
  Zap,
  ShieldCheck,
  Plus,
  Circle,
} from "lucide-react";

import { useTheme } from "../context/theme";
import ThemeToggle from "../components/ThemeToggle";
import AuthPanel from "../components/auth/AuthPanel";
import ChatAnimation from "../components/auth/ChatAnimation";

const AuthPage = () => {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const border = isDark ? "border-white/10" : "border-black/10";
  const muted = isDark ? "text-white/40" : "text-black/40";
  const secondary = isDark ? "text-white/60" : "text-black/55";
  const panel = isDark ? "bg-[#111111]" : "bg-white";
  const soft = isDark ? "bg-white/[0.04]" : "bg-black/[0.035]";

  const iconBox = isDark
    ? "bg-white text-black"
    : "bg-black text-white";

  const buttonStyle = isDark
    ? "bg-white text-black hover:bg-white/85"
    : "bg-black text-white hover:bg-black/80";

  return (
    <main
      className={`min-h-dvh w-full flex flex-col transition-colors duration-300 ${
        isDark
          ? "bg-[#080808] text-white"
          : "bg-[#f7f7f7] text-black"
      }`}
    >
      {/* Navbar */}
      <nav className="h-17 shrink-0 w-full max-w-350 mx-auto px-6 md:px-12 flex items-center justify-between">

        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBox}`}>
            <MessageCircle size={19} />
          </div>

          <span className="text-lg font-bold tracking-tight">
            IChat<span className="opacity-40">.</span>
          </span>
        </div>

        <div className="flex items-center gap-5">
          <span className={`hidden sm:block text-[10px] tracking-[2px] ${muted}`}>
            A BETTER WAY TO CONNECT
          </span>

          <ThemeToggle />
        </div>
      </nav>

      {/* Main Content */}
      <section className="flex-1 w-full max-w-350 mx-auto px-6 md:px-12 py-8 lg:py-5 flex items-center">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 w-full items-center">

          {/* Left Section */}
          <div className="hidden lg:block max-w-137.5">

            <ChatAnimation/>
          </div>

          {/* Right Auth Section */}
          <AuthPanel/>
        </div>
      </section>

     
    </main>
  );
};

export default AuthPage;
