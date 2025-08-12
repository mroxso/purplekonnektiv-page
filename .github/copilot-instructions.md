# Purple Konnektiv Page

Purple Konnektiv is a Next.js 14.2.16 web application that connects users through the Nostr decentralized social protocol. The application features a social feed and calendar functionality, built with TypeScript, Tailwind CSS, and Radix UI components.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Prerequisites and Environment Setup
- Node.js v20+ (tested with v20.19.4)
- npm v10+ (tested with v10.8.2) 
- Internet access for Google Fonts and npm packages

### Core Development Workflow
- Install dependencies: `npm install` -- takes 50-120 seconds depending on network. Expects warnings about deprecated packages (rimraf, eslint, etc.). NEVER CANCEL. Set timeout to 300+ seconds.
- Lint the code: `npm run lint` -- takes 2-5 seconds. Expects warnings about img elements in PostCard.tsx.
- Build for production: `npm run build` -- takes 20-30 seconds. NEVER CANCEL. Set timeout to 180+ seconds.
- Run development server: `npm run dev` -- starts in ~2 seconds on http://localhost:3000
- Run production server: `npm run start` -- requires successful build first, may not work due to standalone configuration

### Known Issues and Workarounds
- **Google Fonts Network Issue**: In environments without internet access, builds fail when importing `Inter` from "next/font/google". 
  - Error: `FetchError: request to https://fonts.googleapis.com/css2?family=Inter... failed`
  - Workaround: In `app/layout.tsx`, comment out `import { Inter } from "next/font/google"`, comment out `const inter = Inter({ subsets: ["latin"] })`, and change `className={inter.className}` to `className="font-sans"`.
- **Docker Build Limitations**: Docker builds fail in restricted environments due to Alpine package manager network access issues (`ERROR: unable to select packages: libc6-compat`).
- **Standalone Build**: The `output: 'standalone'` configuration may not generate standalone directory in all environments, causing `npm run start` to fail.
- **Security Vulnerabilities**: Fresh installs report 1 critical vulnerability. Run `npm audit` for details but avoid `npm audit fix --force` unless necessary.

### Build Commands and Timing
```bash
# NEVER CANCEL these commands - wait for completion
npm install          # 50-120 seconds, expect deprecated package warnings, 1 critical vulnerability
npm run lint         # 2-5 seconds, expect img element warnings  
npm run build        # 20-30 seconds, may fail on Google Fonts in restricted environments
npm run dev          # 2 seconds startup, runs on port 3000
npm run start        # Requires successful build, may fail with standalone config
```

## Validation and Testing

### Manual Validation Scenarios
After making changes, ALWAYS validate by running through these scenarios:

1. **Development Server Test**:
   - Run `npm run dev`
   - Navigate to http://localhost:3000 
   - Verify the header shows "PurpleKonnektiv" with theme toggle button (sun/moon icon)
   - Verify the page loads with two cards: "Calendar" (right/top) and "Social Feed" (left/bottom)
   - Test theme toggle functionality (should switch between light/dark mode)
   - Verify responsive layout: on mobile, Calendar appears first; on desktop, Social Feed appears first

2. **Build Validation**:
   - Run `npm run build` successfully 
   - Check for any new TypeScript errors
   - Verify build completes without critical errors
   - Expected output: "✓ Compiled successfully" with route information

3. **Component Functionality Testing**:
   - **Feed Component**: May show empty state if no Nostr events match filters (#PurpleKonnektiv, #purplekonnektiv hashtags)
   - **Calendar Component**: Should render with "All Events" and "Date Events", "Time Events" tabs (may be empty)
   - **Theme Toggle**: Click moon/sun icon in header to switch between light and dark themes
   - **Navigation**: "PurpleKonnektiv" header should be clickable and purple-colored

4. **Error Scenarios to Validate**:
   - If Google Fonts fails, build should fail with specific FetchError
   - If Nostr relays are unreachable, components should still render without crashing
   - TypeScript errors should prevent successful builds

### Continuous Integration Requirements
- Always run `npm run lint` before committing - the build will fail if linting errors exist
- TypeScript errors will cause build failures
- Ensure img elements use Next.js Image component for production builds

## Project Structure and Navigation

### Key Directories
```
/app                 # Next.js App Router pages
  /globals.css       # Global Tailwind styles
  /layout.tsx        # Root layout with providers
  /page.tsx          # Home page with Feed and Calendar
/components          # Reusable React components
  /ui                # shadcn/ui components
  /Feed.tsx          # Nostr social feed
  /CalendarFeed.tsx  # Calendar component  
  /Header.tsx        # Navigation header
  /PostCard.tsx      # Individual post display
/lib                 # Utility functions
  /utils.ts          # Tailwind utility functions
/documentation       # Nostr protocol documentation
  /nips              # Nostr Improvement Proposals
```

### Important Configuration Files
- `package.json` - Dependencies and scripts
- `next.config.mjs` - Next.js configuration with standalone output
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - shadcn/ui configuration
- `.eslintrc.json` - ESLint configuration
- `tsconfig.json` - TypeScript configuration

### Docker Support (Limited)
The project includes Docker configuration but may not work in all environments:
- `Dockerfile` - Multi-stage build with Node.js 23 Alpine
- `compose.yaml` - Simple service definition
- Docker builds may fail due to network restrictions in sandboxed environments

## Common Tasks and Troubleshooting

### Adding New Components
- Use shadcn/ui components: Place in `/components/ui`
- Custom components: Place in `/components`
- Follow existing patterns using Radix UI primitives

### Nostr Integration
- Nostr providers configured in `app/layout.tsx` with relay URLs
- Feed component filters for `#PurpleKonnektiv` and `#purplekonnektiv` hashtags
- Uses `nostr-react` library for protocol interaction

### Styling Guidelines
- Primary framework: Tailwind CSS with custom purple theme
- Component library: Radix UI with shadcn/ui styling
- Dark mode: Configured via `next-themes` provider
- Responsive design: Mobile-first approach

### Performance Considerations
- Next.js Image optimization available but currently using img elements
- Static generation enabled for optimal loading
- Standalone output configuration for deployment efficiency

## Frequently Run Commands Output

### Repository Root Listing
```
ls -la
.dockerignore         # Docker ignore patterns
.eslintrc.json        # ESLint configuration  
.git/                 # Git repository
.gitignore            # Git ignore patterns
Dockerfile            # Multi-stage Docker build
README.Docker.md      # Docker deployment instructions
README.md             # Basic Next.js getting started
app/                  # Next.js app directory
components/           # React components
components.json       # shadcn/ui configuration
compose.yaml          # Docker compose configuration
documentation/        # Nostr protocol docs
lib/                  # Utility functions
next.config.mjs       # Next.js configuration
package-lock.json     # npm lockfile (230KB)
package.json          # Project dependencies
postcss.config.mjs    # PostCSS configuration
public/               # Static assets
tailwind.config.ts    # Tailwind configuration
tsconfig.json         # TypeScript configuration
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",      // Development server
    "build": "next build",  // Production build
    "start": "next start",  // Production server
    "lint": "next lint"     // ESLint checking
  }
}
```