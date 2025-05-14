import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Backpack Website',
  description: 'Backpack management application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
