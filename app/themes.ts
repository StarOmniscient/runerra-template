//app/themes.ts

//  key should be the same as class name in css eg light, dark

import { Theme } from "@/types/theme";

const THEMES: Theme[] = [
  { key: "light", name: "Light", type: "light" },
  { key: "dark", name: "Dark", type: "dark" },
  { key: "midnight-blurple", name: "Midnight Blurple", type: "dark" },
  { key: "dusk", name: "Dusk", type: "dark" },
  { key: "cotton-candy", name: "Cotton Candy", type: "light" },
  { key: "crimson-moon", name: "Crimson Moon", type: "dark" },
  { key: "emerald-veil", name: "Emerald Veil", type: "dark" },
  { key: "violet-abyss", name: "Violet Abyss", type: "dark" },
  { key: "sunrise-glow", name: "Sunrise Glow", type: "light" },
  { key: "mint-breeze", name: "Mint Breeze", type: "light" },
  { key: "lavender-mist", name: "Lavender Mist", type: "light" },
  { key: "skyline-day", name: "Skyline Day", type: "light" },
  { key: "peach-whisper", name: "Peach Whisper", type: "light" },
  { key: "paper-white", name: "Paper White", type: "light" },
  { key: "citrus-bloom", name: "Citrus Bloom", type: "light" },
  { key: "obsidian-frost", name: "Obsidian Frost", type: "dark" },
  { key: "forest-night", name: "Forest Night", type: "dark" },
  { key: "cosmic-plum", name: "Cosmic Plum", type: "dark" }

];

export { THEMES };