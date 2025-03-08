import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/Common/Sidebar';
import localFont from 'next/font/local';

import '../../styles/globals.scss';
import '../../styles/tailwind.css';

const geistSans = localFont({
  src: '../../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});
const geistMono = localFont({
  src: '../../fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} flex h-screen`}>
        <SidebarProvider>
          <div className="w-1/3 h-full bg-gray-900">
            <AppSidebar />
          </div>
          <div className="flex-1 h-full overflow-auto">{children}</div>
        </SidebarProvider>
      </body>
    </html>
  );
}

