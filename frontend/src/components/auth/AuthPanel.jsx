
import React from "react";
import { SignInButton } from "@clerk/react";
import { Button } from "@heroui/react";
import {
  MessageCircle,
  ArrowUpRight,
  LockKeyhole,
  Circle,
} from "lucide-react";
import { useTheme } from "../../context/theme";

const AuthPanel = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const border = isDark ? "border-white/10" : "border-black/10";
  const muted = isDark ? "text-white/40" : "text-black/40";
  const secondary = isDark ? "text-white/60" : "text-black/55";
  const panel = isDark ? "bg-[#111111]" : "bg-white";

  return (
    <div className="w-full flex justify-center lg:justify-end">
      <div
        className={`w-full max-w-102.5 border ${border} ${panel} rounded-[26px] p-6 sm:p-8`}
      >
        <div className="flex justify-between items-center mb-7">
          <span
            className={`text-[9px] tracking-[2px] font-semibold ${muted}`}
          >
            GET STARTED
          </span>

          <span className={`flex items-center gap-1.5 text-[9px] ${muted}`}>
            <Circle size={7} fill="currentColor" />
            PRIVATE SPACE
          </span>
        </div>

        <div
          className={`w-12 h-12 rounded-[15px] flex items-center justify-center mb-5 ${
            isDark ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          <MessageCircle size={23} />
        </div>

        <h2 className="text-[32px] font-semibold tracking-[-1.5px]">
          Welcome back.
        </h2>

        <p className={`mt-2 text-[13px] leading-6 ${secondary}`}>
          Your conversations are waiting. Sign in and pick up right where
          you left off.
        </p>

        <div className="mt-7">
          <SignInButton mode="modal">
            <Button
              className={`w-full h-13 rounded-xl font-semibold text-sm ${
                isDark
                  ? "bg-white text-black hover:bg-white/85"
                  : "bg-black text-white hover:bg-black/80"
              }`}
              endContent={<ArrowUpRight size={18} />}
            >
              Continue with email
            </Button>
          </SignInButton>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div
            className={`h-px flex-1 ${
              isDark ? "bg-white/10" : "bg-black/10"
            }`}
          />

          <span className={`text-[9px] tracking-[1.5px] ${muted}`}>
            SIMPLE & SECURE
          </span>

          <div
            className={`h-px flex-1 ${
              isDark ? "bg-white/10" : "bg-black/10"
            }`}
          />
        </div>

        <div className={`border ${border} rounded-xl p-3.5 flex gap-3`}>
          <LockKeyhole size={16} className={`mt-0.5 shrink-0 ${muted}`} />

          <div>
            <p className="text-xs font-semibold">
              Your privacy matters
            </p>

            <p className={`text-[10px] leading-5 mt-1 ${muted}`}>
              Secure authentication powered by Clerk.
            </p>
          </div>
        </div>

        <p className={`mt-6 text-center text-[10px] leading-5 ${muted}`}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default AuthPanel;
