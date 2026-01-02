# Simple CRM

A lightweight Customer Relationship Management system built with React and Supabase.

## Features

- User authentication (register/login)
- Customer management (CRUD operations)
- Customer status tracking (New, Contacted, Interested, Closed)
- Interaction logging (calls, emails, meetings, notes)
- Follow-up reminders
- Dashboard with statistics

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **State Management**: TanStack Query + React Context

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Database Schema

The application uses two main tables:
- `customers`: Store customer information and status
- `interactions`: Log customer interactions and communications

Row Level Security (RLS) is enabled to ensure users can only access their own data.

## Usage

1. Register/Login to access the CRM
2. Add customers with contact information
3. Track customer status through the sales pipeline
4. Log interactions and set follow-up dates
5. View dashboard for overview and upcoming tasks