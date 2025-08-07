# AI Image Generator Frontend

This is the frontend for an AI Image Generator application, built with [Next.js](https://nextjs.org/) and designed to be deployed on [Vercel](https://vercel.com/).

## Features

- Generate images using an AI-powered backend
- Modern Next.js 13+ App Router structure
- Optimized for serverless deployment on Vercel

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 3. Environment Variables

Create a `.env.local` file in the `frontend` directory and add your environment variables as needed (for example, API keys for image generation).

```bash
# .env.local
API_URL=http://localhost:8000/api
# Add other variables as needed
```

### 4. Build for Production

```bash
npm run build
npm start
```

## Deployment

This project is ready to deploy on Vercel.

- The `vercel.json` file configures serverless function memory and timeout.
- Make sure your API endpoints and environment variables are configured for production.

## Project Structure

```
frontend/
  ├── src/
  │   └── app/
  │       ├── api/
  │       │   └── generate/route.js
  │       └── page.js
  ├── .gitignore
  ├── README.md
  └── ...
```

## Customization

- Update UI and styles in `src/app/page.js`.
- Update API logic in `src/app/api/generate/route.js`.

## License

This project is for educational and personal use. For production or commercial use, please review dependencies’ licenses.
