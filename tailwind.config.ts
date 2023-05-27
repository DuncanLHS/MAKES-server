import { type Config } from "tailwindcss";

export default {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
} satisfies Config;
