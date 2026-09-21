import Link from "next/link";

/**
 * Phone and email live here, not in the announcement bar.
 *
 * The bar is dismissible and sits above the fold on every page, so contact
 * details there cost prime space to everyone while being one tap from
 * disappearing for good. The footer is where people look for them, and it
 * cannot be dismissed.
 */
const CONTACT = {
	phone: { number: "07859 790386", href: "tel:07859790386" },
	email: { address: "info@casspea.co.uk", href: "mailto:info@casspea.co.uk" },
};

export default function Footer() {
	return (
		// Same token as the announcement bar (bg-primary + text-primary-text-light),
		// so the top and bottom of every page stay the same colour whatever the
		// palette is set to. It used to be bg-gray-100, which only matched the
		// old teal by accident and stopped matching when the palette changed.
		<footer className='bg-primary text-primary-text-light'>
			{/* The WhatsApp button floats at bottom-6 right-6, so at the very
			    bottom of a page it would otherwise sit on the footer text. */}
			<div className='px-2 pt-4 pb-24 md:pb-4'>
				<div className='flex flex-col items-center justify-center gap-1'>
					<p className='text-sm text-primary-text-light'>
						<a
							href={CONTACT.phone.href}
							className='underline hover:no-underline underline-offset-2'
						>
							{CONTACT.phone.number}
						</a>
						<span aria-hidden="true" className='mx-2'>·</span>
						<a
							href={CONTACT.email.href}
							className='underline hover:no-underline underline-offset-2'
						>
							{CONTACT.email.address}
						</a>
					</p>
					<p className='text-xs text-primary-text-light'>
						&copy; 2026 CassPea LTD. All rights reserved.
					</p>
					<p className='text-xs text-primary-text-light'>
						<Link href="/orders">Log In</Link>
					</p>
				</div>
			</div>
		</footer>
	);
}
