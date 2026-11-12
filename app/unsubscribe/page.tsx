import type { Metadata } from 'next';
import UnsubscribeForm from '@/components/newsletter/UnsubscribeForm';

// Linked from the footer of every email we send (BUG-08 in
// docs/plan-rediseno-seguro.md: the link used to lead nowhere).
export const metadata: Metadata = {
    title: 'Unsubscribe',
    description: 'Stop marketing emails from CassPea.',
    robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
    return (
        <div className="dark:bg-main-bg-dark min-h-screen">
            <UnsubscribeForm />
        </div>
    );
}
