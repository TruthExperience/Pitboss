#!/bin/bash

# Setup script for Next.js 14 project with Tailwind CSS, Supabase and additional dependencies

# Initialize a new Next.js project
npx create-next-app@latest my-next-app

# Change directory to the new project
cd my-next-app

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Supabase client
npm install @supabase/supabase-js

# Additional dependencies can be added here
# e.g. npm install some-other-package

# Tailwind configuration
echo "// tailwind.config.js"
{
  "content": [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  "theme": {
    "extend": {}
  },
  "plugins": []
}

# Let's inform the user that the setup is complete
echo "Setup complete! Run 'npm run dev' to start the development server."