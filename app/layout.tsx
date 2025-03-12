import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Text Behind Subject',
  description: 'Create social media thumbnails with text behind subjects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon.png" type="image/png" />
      <body>{children}</body>
    </html>
  );
} 