import type { Config } from 'tailwindcss'
import formsPlugin from '@tailwindcss/forms'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [formsPlugin],
}

export default config 