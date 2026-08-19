import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AppProviders } from '@/context/AppContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'STR Platform',
  description: 'Eco-friendly pickup marketplace for vendors, couriers, and admins.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <AppProviders>
          <Header />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
