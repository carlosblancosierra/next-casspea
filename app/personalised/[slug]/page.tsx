'use client';

import PersonalizedDetail from '@/components/personalized/PersonalizedDetail';
import { useParams } from 'next/navigation';

export default function Page() {
	const params = useParams();
	return (
		<>
			<main className='mx-auto max-w-screen-2xl'>
				<PersonalizedDetail slug={params.slug} />
			</main>
		</>
	);
}
