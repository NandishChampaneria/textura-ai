# Textura.ai - Text on Image Editor

A modern web application for adding and manipulating text on images with background removal capabilities.

## Features

- 🖼️ Background removal from images (processed locally in the browser)
- ✍️ Multiple text layers support
- 🎨 Rich text customization options
- 🌓 Dark/Light mode
- 📱 Responsive design
- ⚡ Real-time preview
- 💾 High-quality image export
- 🔒 Privacy-focused (all processing done client-side)

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- @imgly/background-removal (client-side processing)

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/NandishChampaneria/textura-ai.git
cd textura-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy on Vercel (Recommended)

The easiest way to deploy this application is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Create an account or sign in
4. Click "Import Project"
5. Select your repository
6. Click "Deploy"

That's it! Your app will be deployed and you'll get a production URL.

### Alternative Deployment Options

#### Deploy on Railway

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Create an account
4. Create a new project
5. Connect your GitHub repository
6. Deploy

#### Deploy on DigitalOcean App Platform

1. Fork this repository
2. Create a new app on DigitalOcean App Platform
3. Connect your repository
4. Deploy

## Privacy & Security

- All image processing is done client-side in the browser
- No server storage of images
- No API keys required
- Secure headers configured for production

## License

MIT License - feel free to use this project for personal or commercial purposes.
