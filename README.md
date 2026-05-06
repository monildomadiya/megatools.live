# Mega Tools - Production-Ready Tools Platform

Mega Tools is a high-performance, SEO-first, and AdSense-ready tools website built with Next.js (App Router). It features a scalable architecture designed to support 1000+ tools.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Docker-ready

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file based on `.env.example`
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure
- `/app`: Main pages and dynamic routing.
- `/components`: Reusable UI, Layout, and Tool components.
- `/data`: Static data for tools, categories, and blog posts.
- `/lib`: Logic for calculators, SEO helpers, and utilities.
- `/types`: TypeScript interfaces.

## How to Add a New Tool
1. Add the tool definition in `data/tools.ts`.
2. Implement the calculation logic in `lib/calculators.ts`.
3. The tool will automatically appear in the directory and category pages with its own SEO-optimized dynamic route.

## SEO & AdSense
- Every page includes unique meta tags and JSON-LD schema via the Metadata API.
- Reusable `AdSlot` components are placed strategically for maximum revenue without affecting user experience.
- Legal pages (Privacy, Terms, etc.) are included for AdSense compliance.

## Deployment on DigitalOcean
1. Create a new App on DigitalOcean.
2. Connect your repository.
3. The included `Dockerfile` will automatically handle the build and deployment process.
4. Set environment variables in the DigitalOcean dashboard.

## Future Scalability
- **Database**: The tool registry in `data/tools.ts` can be easily migrated to a database like PostgreSQL using Prisma or Supabase.
- **Admin Panel**: Add an admin interface to manage tools and blog posts via an API layer in `/app/api`.
- **Programmatic SEO**: Expand to thousands of tools by automating data generation for similar categories.
