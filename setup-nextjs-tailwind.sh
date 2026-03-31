npx create-next-app@latest pitboss --typescript
cd pitboss

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Dependencies
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs discord.js next-auth shadcn/ui

# Setup Tailwind CSS
// In tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

// In globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;
