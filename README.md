# PitBoss - Truth Racing League & World Series Championship Certification System

## Overview
PitBoss is a Next.js Progressive Web App created as the Phase 1 initiative in building a universal governance and certification platform for competitive sim racing leagues. This platform is tailor-fit for the Truth Racing League (TRL) and World Series Championship (WSC). The project focuses exclusively on the certification system for sim-racing roles.

## Build Rules
1. **Build one feature at a time.** Test and verify it before proceeding to the next.
2. Stay within the scope of Phase 1. No features outside this specification will be implemented.
3. Follow the outlined build order exactly. Steps must be verified functional before proceeding.

## Tech Stack
- **Frontend:** Next.js 14, React, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/)
- **Backend:** Next.js API routes
- **Database:** Supabase (Postgres)
- **Authentication:** Supabase Auth (Email/Password & Discord OAuth)
- **AI Generation:** [Claude API (Claude-Sonnet-4)](https://www.anthropic.com/index/claude) via Cloudflare Workers
- **Hosting:** Vercel
- **Discord Bot:** discord.js v14 for notification features

## Environment Variables
The system references environment variables pre-configured in Vercel. Ensure these are correctly set:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ANTHROPIC_API_KEY
- CLOUDFLARE_WORKER_URL
- DISCORD_CLIENT_ID
- DISCORD_CLIENT_SECRET
- DISCORD_BOT_TOKEN
- DISCORD_WSC_ADMIN_USER_ID
- COMMISSIONER_DISCORD_USER_ID

## Database Schema
The project employs the following schema:

### Extensions
```sql
create extension if not exists "uuid-ossp";
```
### Tables
#### `leagues`
Manage overarching competitive entities.
```sql
create table leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ...
);
```
#### `members`, `certifications`, etc.
[Details abbreviated for succinct README example. Full build specs outlined in project documentation.]

## Phase 1 Build Steps
### Step 1: Project Setup
- Initialize a Next.js 14 app...
### Step 2: Database...
### Step 6 Practical Scenarios Ex Track## pitourage---< continue verify speach;}
