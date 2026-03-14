"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Toggle } from "radix-ui";
import { Moon, Sun } from "lucide-react";
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="default"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <div className="relative h-4 w-4">
        <Sun className="absolute transition-transform dark:scale-0" />
        <Moon className="absolute scale-0 transition-transform dark:scale-100" />
        <span className="sr-only">Toggle Theme</span>
      </div>
    </Button>
  );
};

export default ThemeToggle;
