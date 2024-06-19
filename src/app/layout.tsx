import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pokemon Matcher',
  description:
    'You will be given a set of pokemon depending on your desired settings. Once you click on one, theyll be hidden and shuffled! Make sure not to click on the same one again and keep going until you got all of them.',
  creator: 'Seth Casey',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
