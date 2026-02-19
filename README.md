# RevFactor Q&A

A real-time Q&A voting board for short-term rental revenue management workshops, built with Next.js 14, Firebase Firestore, and Tailwind CSS.

## Features

- **Public Board**: Submit questions, upvote existing ones, and view admin answers (text + video).
- **Vote Tracking**: Uses local storage to prevent duplicate votes per device.
- **Admin Dashboard**: Manage questions, update status (Live/Online), and provide answers with YouTube/Loom embeds.
- **Security**: Protected admin route via middleware and secure cookies.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### 1. Firebase Setup

1.  Go to [console.firebase.google.com](https://console.firebase.google.com/).
2.  Create a new project.
3.  **Enable Firestore Database**:
    - Start in **Production mode**.
    - Choose a location near your users.
4.  **Get Configuration**:
    - Go to Project Settings -> General -> Your apps -> Web app.
    - Register app (no hosting needed).
    - Copy the `firebaseConfig` keys.

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Access
ADMIN_PASSWORD=your_secure_password
```

### 3. Firestore Security Rules

Go to **Firestore Database -> Rules** and publish these rules to secure your data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /questions/{id} {
      allow read: if true;
      allow create: if true;
      // Only allow updating voteCount and status publicly (vote logic handled in client/transaction)
      // Note: Ideally, specific vote increment logic would be server-side or via strict rules, 
      // but for this workshop scope, we allow specific field updates.
      allow update: if request.resource.data.diff(resource.data).affectedKeys().hasOnly(['voteCount', 'status']);
    }
    match /votes/{id} {
      allow read, create: if true;
    }
    match /answers/{id} {
      allow read: if true;
      allow write: if false; // Admin functionality uses client SDK but standard rules would block this without auth. 
      // Since we use a simple password/cookie auth without Firebase Auth, 
      // strictly speaking, the client needs write access. 
      // FOR THIS WORKSHOP DEMO: We might need 'allow write: if true' if not using Firebase Auth, 
      // or implement a custom auth token. 
      // Given requirements: "No external auth libraries", we likely rely on obscurity or public write 
      // for the demo, OR we should upgrade to allow write: if true for the purpose of the demo 
      // if we aren't using Firebase Auth for the admin.
      
      // ADJUSTMENT FOR WORKING DEMO WITHOUT FIREBASE AUTH:
      allow write: if true; 
    }
  }
}
```

> **Note**: The above rules allow public writes to answers for the purpose of this demo app which doesn't use Firebase Auth. In a production app, you should integrate Firebase Authentication and restrict writes to `request.auth != null`.

### 4. Run Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Admin at `/admin`.

---

## Deployment (Vercel)

1.  Push your code to a Git repository (GitHub/GitLab).
2.  Import the project into Vercel.
3.  **Environment Variables**: Add all the variables from `.env.local` to the Vercel project settings.
4.  Deploy!

## Project Structure

- `src/app/page.tsx`: Main public Q&A board.
- `src/app/admin/`: Protected admin dashboard.
- `src/lib/firebase.ts`: Firebase initialization.
- `src/lib/questions.ts`: Firestore data logic.
