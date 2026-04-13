# Project Hub Prototype (Vercel-ready)

This is a Next.js prototype based on your requested product layout:
- sign-in with email + phone
- optional payment fields
- home page with search
- left navigation with Home, My Projects, Settings, Account Profile
- favorites / saved projects
- public vs private project visibility
- recent activity
- project thumbnails
- collaboration placeholder for future sharing

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Create a GitHub repository.
2. Upload these files to the repo.
3. Go to Vercel and import the repository.
4. Use the default Next.js settings.
5. Click **Deploy**.

Vercel will generate a live URL for you automatically.

## Notes

- This is a front-end prototype only.
- Data is stored in React state for demo purposes.
- For real auth and storage, connect Firebase or Supabase.
- For real payments, use Stripe.
