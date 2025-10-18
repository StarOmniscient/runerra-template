"use client"
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export default function AppearanceSettings() {
    const { theme, setTheme } = useTheme();

    // fucking hydration idc
    return (
        <div>
            <p>Current: {theme}</p>
            <Button onClick={() => setTheme('light')}>Light</Button>
            <Button onClick={() => setTheme('dark')}>Dark</Button>
            <Button onClick={() => setTheme('midnight-blurple')}>Midnight Blurple</Button>
        </div>
    );
}