import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'NOVA AI Studio - Next-Gen AI Workspace & Agent Platform',
  description: 'Next-generation production AI Workspace: Coding Agent, Website & App Builder, Live Multi-Device Preview, Sandbox, Image & Video Studio, File Analysis, and Model Registry.',
  openGraph: {
    title: 'NOVA AI Studio - Next-Gen AI Workspace & Agent Platform',
    description: 'Next-generation production AI Workspace: Coding Agent, Website & App Builder, Live Multi-Device Preview, Sandbox, Image & Video Studio, File Analysis, and Model Registry.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOVA AI Studio - Next-Gen AI Workspace & Agent Platform',
    description: 'Next-generation production AI Workspace: Coding Agent, Website & App Builder, Live Multi-Device Preview, Sandbox, Image & Video Studio, File Analysis, and Model Registry.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
