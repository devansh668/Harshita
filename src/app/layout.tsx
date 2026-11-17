import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Happy Birthday, Beautiful! ✨ A Special Surprise For You',
  description:
    'A magical, personalized birthday gift website celebrating your memories, art transformations, and unforgettable moments.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-pink-200 selection:text-pink-900">
        {children}
      </body>
    </html>
  );
}
