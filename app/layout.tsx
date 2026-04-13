import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Project Hub Prototype',
  description: 'Vercel-ready prototype for a project platform.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
