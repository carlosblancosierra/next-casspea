import { ChangeEvent } from 'react';
import Link from 'next/link';
import UiInput from '@/components/ui/Input';

interface Props {
	labelId: string;
	type: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	value: string;
	children: React.ReactNode;
	link?: {
		linkText: string;
		linkUrl: string;
	};
	required?: boolean;
}

// Thin adapter kept so Form/LoginForm's existing config-driven API is unchanged;
// all styling (including the dark-mode pairs) lives in components/ui/Input.
export default function Input({
	labelId,
	type,
	onChange,
	value,
	children,
	link,
	required = false,
}: Props) {
	return (
		<UiInput
			id={labelId}
			label={children}
			type={type}
			onChange={onChange}
			value={value}
			required={required}
			labelAction={
				link ? (
					<Link
						className='font-semibold text-primary hover:text-primary-dark'
						href={link.linkUrl}
					>
						{link.linkText}
					</Link>
				) : undefined
			}
		/>
	);
}
