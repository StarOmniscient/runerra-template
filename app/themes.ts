

//  key should be the same as class name in css eg light, dark

import { Theme } from "@/types/theme";

const THEMES: Theme[] = [
  { key: "light", name: "Light", type: "light" },
  { key: "dark", name: "Dark", type: "dark" },
  { key: "midnight-blurple", name: "Midnight Blurple", type: "dark" },
  { key: "dusk", name: "Dusk", type: "dark" },
  { key: "cotton-candy", name: "Cotton Candy", type: "light" },
  { key: "crimson-moon", name: "Crimson Moon", type: "dark" },
  
];

export { THEMES };