#!/bin/bash
set -e

# ─────────────────────────────────────────────

# Pitboss – Next.js + Tailwind + Supabase setup

# ─────────────────────────────────────────────

echo “>>> Creating Next.js app…”
npx create-next-app@latest pitboss   
–typescript   
–tailwind   
–eslint   
–app   
–src-dir   
–import-alias “@/*”

cd pitboss

echo “>>> Installing project dependencies…”
npm install   
@supabase/supabase-js   
@supabase/auth-helpers-nextjs   
discord.js   
next-auth

echo “>>> Initialising shadcn/ui…”
npx shadcn-ui@latest init –yes

echo “>>> Writing tailwind.config.ts…”
cat > tailwind.config.ts << ‘TAILWIND’
import type { Config } from “tailwindcss”;

const config: Config = {
content: [
“./src/app/**/*.{js,ts,jsx,tsx,mdx}”,
“./src/pages/**/*.{js,ts,jsx,tsx,mdx}”,
“./src/components/**/*.{js,ts,jsx,tsx,mdx}”,
],
theme: {
extend: {},
},
plugins: [],
};

export default config;
TAILWIND

echo “>>> Writing src/app/globals.css…”
cat > src/app/globals.css << ‘GLOBALS’
@tailwind base;
@tailwind components;
@tailwind utilities;
GLOBALS

echo “>>> Creating .env.local template…”
cat > .env.local << ‘ENVLOCAL’
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
CLOUDFLARE_WORKER_URL=
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
DISCORD_BOT_TOKEN=
DISCORD_WSC_ADMIN_USER_ID=
COMMISSIONER_DISCORD_USER_ID=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
ENVLOCAL

echo “”
echo “✅ Pitboss setup complete!”
echo “”
echo “Next steps:”
echo “  1. cd pitboss”
echo “  2. Fill in .env.local with your credentials”
echo “  3. npm run dev”
