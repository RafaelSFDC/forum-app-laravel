import { AppShell } from '@/components/app-shell';
import { type PropsWithChildren } from 'react';

export default function ForumLayout({ children }: PropsWithChildren) {
    return (
        <AppShell variant="header">
            {children}
        </AppShell>
    );
}
