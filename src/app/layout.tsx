import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Presell Genius | AI-Powered Presell Page Generator',
  description: 'Generate high-converting presell pages in seconds with AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background selection:bg-accent/30">
        {children}
      </body>
    </html>
  );
}
