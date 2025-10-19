"use client"
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { THEMES } from "@/app/themes";
// List of themes and their display names


// Helper component to render a color swatch
const ColorSwatch = ({ color, label }: { color: string; label: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-6 h-6 rounded-sm border border-border"
        style={{ backgroundColor: color }}
        title={color} // Shows full color value on hover
      />
      <span className="text-xs mt-1">{label}</span>
    </div>
  );
};

// Helper function to get computed CSS variable value from a specific class context
const getThemeColor = (themeClass: string, colorVar: string): string => {
  // Create a temporary element and apply the theme class
  const tempElement = document.createElement("div");
  tempElement.className = themeClass;
  tempElement.style.position = "absolute"; // Keep it out of the layout
  tempElement.style.visibility = "hidden";
  document.body.appendChild(tempElement);

  // Get the computed style for the CSS variable
  const computedStyle = getComputedStyle(tempElement);
  const colorValue = computedStyle.getPropertyValue(colorVar).trim();

  // Clean up: remove the temporary element
  document.body.removeChild(tempElement);

  return colorValue || "transparent"; // Fallback if variable is not found
};

// Helper function to get text color based on background luminance for better contrast
// Uses a temporary element to apply the theme and get the background color
const getTextColorForTheme = (themeClass: string): string => {
  const tempElement = document.createElement("div");
  tempElement.className = themeClass;
  tempElement.style.position = "absolute";
  tempElement.style.visibility = "hidden";
  document.body.appendChild(tempElement);

  const computedStyle = getComputedStyle(tempElement);
  const bgColorValue = computedStyle.getPropertyValue("--background").trim();
  document.body.removeChild(tempElement);

  // Attempt to parse oklch to get lightness (L)
  // Format: oklch(L c h) or oklch(L c h / alpha)
  const match = bgColorValue.match(/oklch\(\s*([\d.]+)\s+/);
  if (match) {
    const lightness = parseFloat(match[1]);
    return lightness > 0.5 ? "text-foreground" : "text-white";
  }

  // Fallback for other color formats (less reliable)
  // You could implement more sophisticated parsing here if needed
  return "text-foreground";
};

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  const [themeColors, setThemeColors] = useState<Record<string, { primary: string; secondary: string; accent: string; background: string }>>({});

  // Fetch color values from CSS when component mounts or themes change
  useEffect(() => {
    const fetchColors = () => {
      const colors: Record<string, { primary: string; secondary: string; accent: string; background: string }> = {};
      
      THEMES.forEach(({ key }) => {
        // Apply the theme class to the root element temporarily to get dark mode colors if needed
        // We create a temporary element for each theme instead to avoid side effects
        colors[key] = {
          primary: getThemeColor(key, "--primary"),
          secondary: getThemeColor(key, "--secondary"),
          accent: getThemeColor(key, "--accent"), // Using --accent for the accent swatch
          background: getThemeColor(key, "--background"),
        };
      });
      
      setThemeColors(colors);
    };

    fetchColors();

    // Optional: Re-fetch if the page's theme class changes externally
    // This might be needed if theme switching happens outside of next-themes
    // const observer = new MutationObserver(fetchColors);
    // observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    // return () => observer.disconnect();
  }, []); // Empty dependency array means this runs once on mount

  // Group themes by type
  const groupedThemes = THEMES.reduce((acc, theme) => {
    if (!acc[theme.type]) {
      acc[theme.type] = [];
    }
    acc[theme.type].push(theme);
    return acc;
  }, {} as Record<string, typeof THEMES>);

  return (
    <div className="space-y-6">
      <p className="text-lg font-medium">
        Current Theme:{" "}
        <span className="font-semibold">
          {THEMES.find(t => t.key === theme)?.name || theme}
        </span>
      </p>

      {/* Iterate over grouped theme types */}
      {Object.entries(groupedThemes).map(([type, themes]) => (
        <div key={type} className="space-y-2">
          <h2 className="text-xl font-semibold capitalize">{type} Themes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {themes.map(({ key, name }) => {
              const isCurrent = theme === key;
              const colors = themeColors[key];
              // Only calculate text color if colors are loaded
              const textColorClass = colors ? getTextColorForTheme(key) : "text-foreground";

              return (
                <div
                  key={key}
                  className={`border rounded-lg p-4 flex flex-col ${
                    isCurrent ? "ring-2 ring-ring ring-offset-2" : "border-border"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`${textColorClass} font-medium`}>{name}</h3>
                    <Button
                      variant={isCurrent ? "secondary" : "outline"} // Show as selected
                      size="sm"
                      onClick={() => setTheme(key)}
                      className="ml-2 text-xs"
                      disabled={!colors} // Disable button if colors haven't loaded yet
                    >
                      {isCurrent ? "Active" : "Apply"}
                    </Button>
                  </div>
                  {colors && (
                    <div className="flex space-x-2 justify-center mt-auto">
                      <ColorSwatch color={colors.primary} label="Primary" />
                      <ColorSwatch color={colors.secondary} label="Secondary" />
                      <ColorSwatch color={colors.accent} label="Accent" />
                    </div>
                  )}
                  {!colors && (
                    <div className="flex justify-center items-center mt-auto h-6">
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}