import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Textura.ai - Text Behind Image Editor',
  description: 'Create stunning text overlays behind subjects in your images. Professional image editing tool for social media thumbnails and graphics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
} 