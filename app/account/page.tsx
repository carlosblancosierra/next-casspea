import type { Metadata } from 'next';
import AccountOverview from '@/components/account/AccountOverview';

export const metadata: Metadata = {
	title: 'Your account | CassPea',
	robots: { index: false },
};

export default function AccountPage() {
	return <AccountOverview />;
}
