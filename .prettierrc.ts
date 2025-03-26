
import { type Config } from "prettier";

const config: Config = {
  trailingComma: "none",
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  bracketSpacing: true,
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/style.css",
  htmlWhitespaceSensitivity: "ignore",
};

export default config;
