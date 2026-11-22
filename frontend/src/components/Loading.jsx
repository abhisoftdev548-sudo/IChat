import React from "react";
import { useTheme } from "../context/theme";

export default function Loading({ text = "Loading..." }) {
    const { theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <div
            className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-8 ${
                isDark ? "bg-[#080808]" : "bg-[#f8f8fa]"
            }`}
        >
            {/* Animated Loader */}
            <div className="relative flex size-24 items-center justify-center">

                {/* Glow */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />

                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border border-default-300/30" />

                {/* Spinning Ring */}
                <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-r-primary/40 animate-spin" />

                {/* Inner Ring */}
                <div className="absolute inset-4 rounded-full border border-primary/20 animate-[spin_4s_linear_infinite_reverse]" />

                {/* Center Logo */}
                <div className="relative flex size-12 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-lg shadow-primary/30 animate-pulse">
                    I
                </div>
            </div>

            {/* Brand & Loading Text */}
            <div className="flex flex-col items-center gap-3">
                <h1 className={`text-2xl font-bold tracking-tight ${
                    isDark ? "text-white" : "text-black"
                }`}>
                    IChat<span className="text-primary">.</span>
                </h1>

                <p className="text-sm text-default-400">
                    {text}
                </p>

                {/* Loading Dots */}
                <div className="mt-1 flex gap-1.5">
                    {[0, 1, 2].map((item) => (
                        <span
                            key={item}
                            className="size-1.5 rounded-full bg-primary animate-bounce"
                            style={{
                                animationDelay: `${item * 150}ms`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <p className="absolute bottom-8 text-[10px] uppercase tracking-[0.2em] text-default-400">
                Connecting people, seamlessly.
            </p>
        </div>
    );
}