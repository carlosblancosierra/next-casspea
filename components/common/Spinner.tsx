import cn from 'classnames';
import { ImSpinner3 } from 'react-icons/im';

interface Props {
	sm?: boolean;
	md?: boolean;
	lg?: boolean;
	className?: string;
}

export default function Spinner({ sm, md, lg, className }: Props) {
	const classNames = cn('animate-spin text-white-300 fill-white-300 mr-2', {
		'w-4 h-4': sm,
		'w-6 h-6': md,
		'w-8 h-8': lg,
	});

	return (
		<div role='status'>
			<ImSpinner3 className={cn(classNames, className)} />
			<span className='sr-only'>Loading...</span>
		</div>
	);
}
