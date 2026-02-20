# CLAUDE.md

## Project Overview

**RevFactor Q&A** is a real-time Q&A voting board for short-term rental revenue management workshops. Attendees submit questions and vote on others; admins manage answers and statuses via a protected dashboard.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Auth**: Cookie-based admin auth (middleware-protected)

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Public Q&A board
│   ├── layout.tsx            # Root layout (fonts, analytics)
│   ├── admin/
│   │   ├── page.tsx          # Admin dashboard
│   │   ├── login/page.tsx    # Admin login
│   │   └── layout.tsx        # Admin layout
│   └── api/admin/auth/
│       └── route.ts          # Auth POST endpoint (sets cookie)
├── components/
│   ├── QuestionForm.tsx       # Submit question form
│   ├── QuestionList.tsx       # Question list with loading skeletons
│   ├── QuestionCard.tsx       # Public card (vote, answers, embeds)
│   ├── AdminQuestionCard.tsx  # Admin card (edit answer, status)
│   ├── MarketingFooter.tsx    # Branded footer
│   └── ui/                   # shadcn/ui primitives
├── lib/
│   ├── firebase.ts            # Firestore initialization
│   ├── questions.ts           # All Firestore CRUD operations
│   ├── fingerprint.ts         # Device fingerprint for vote dedup
│   └── utils.ts               # cn() utility
├── types/
│   └── index.ts               # Question, Answer interfaces
└── middleware.ts               # Protects /admin/* routes
```

## Environment Variables

Create `.env.local` with:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
ADMIN_PASSWORD=
```

## Key Architecture Decisions

### Authentication
- Simple cookie-based admin auth (`rf_admin` cookie)
- `src/middleware.ts` validates the cookie against `ADMIN_PASSWORD` env var
- API route `POST /api/admin/auth` sets a 24-hour httpOnly, secure, sameSite cookie
- No Firebase Authentication — intentionally simple for workshop context

### Vote Deduplication
Two-layer system:
1. **Firestore**: stores `votes` subcollection with `questionId + deviceFingerprint`
2. **localStorage**: tracks voted question IDs for optimistic UI updates
- `submitVote()` uses Firestore transactions to prevent race conditions

### Server vs. Client Components
- Page-level components are server components by default
- Interactive components use `"use client"` directive
- Keeps performance high by server-rendering static content

### Video Embeds
- Regex-based URL parsing for YouTube and Loom
- Converts share URLs to embed iframe sources
- Fallback message displayed if parsing fails

## Custom Design Tokens (Tailwind)

| Token     | Hex       | Usage              |
|-----------|-----------|--------------------|
| `bone`    | `#DDDAD3` | Backgrounds        |
| `moss`    | `#5D6D59` | Answered Live badge|
| `cedar`   | `#13342D` | Primary dark       |
| `walnut`  | `#76574C` | Answered Online    |
| `tobacco` | `#3F261F` | Dark brown         |
| `onyx`    | `#161910` | Near-black         |

Fonts: `Cormorant Garamond` (headings), `Inter` (body)

## Firestore Operations (`src/lib/questions.ts`)

| Function                  | Description                                    |
|---------------------------|------------------------------------------------|
| `getQuestionsWithAnswers()` | Fetch all questions + answers                 |
| `submitQuestion()`         | Add new question                               |
| `submitVote()`             | Vote with transaction safety (no duplicates)   |
| `updateAnswer()`           | Add/update answer text and video URL           |
| `updateStatus()`           | Change question status (Pending/Live/Online)   |

## Question Status Flow

```
Pending → Answered Live → Answered Online
```

Status badges are color-coded: Moss (Live), Walnut (Online), Gray (Pending).

## Path Aliases

`@/*` maps to `./src/*` — use for all imports.

## Notes

- Firestore security rules allow public writes for demo purposes; tighten for production
- Real-time listeners are not implemented yet — Firestore is polled on mount
- HoneyBook analytics script is included in `layout.tsx`
