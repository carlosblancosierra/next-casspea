import Link from "next/link";
import { CONTACT, COMPANY, FOOTER_SECTIONS } from "./siteLinks";

/**
 * Phone and email live here, not in the announcement bar.
 *
 * The bar is dismissible and sits above the fold on every page, so contact
 * details there cost prime space to everyone while being one tap from
 * disappearing for good. The footer is where people look for them, and it
 * cannot be dismissed.
 *
 * It also repeats every page in the navbar, so someone who scrolled to the
 * bottom can carry on without scrolling back up.
 */
export default function Footer() {
	return (
		// Same token as the announcement bar (bg-primary + text-primary-text-light),
		// so the top and bottom of every page stay the same colour whatever the
		// palette is set to. It used to be bg-gray-100, which only matched the
		// old teal by accident and stopped matching when the palette changed.
		<footer className='bg-primary text-primary-text-light'>
			{/* The WhatsApp button floats at bottom-6 right-6, so at the very
			    bottom of a page it would otherwise sit on the footer text. */}
			<div className='mx-auto max-w-screen-xl px-4 pt-8 pb-24 md:pb-6'>
				<nav aria-label='Footer' className='mx-auto grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-3 text-center sm:text-left'>
					{FOOTER_SECTIONS.map((section) => (
						<div key={section.title} className='last:col-span-2 sm:last:col-span-1'>
							<h2 className='text-sm font-semibold uppercase tracking-wide'>{section.title}</h2>
							<ul className='mt-3 space-y-2 text-sm'>
								{section.links.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											target={link.external ? '_blank' : undefined}
											rel={link.external ? 'noopener noreferrer' : undefined}
											className='hover:underline underline-offset-2'
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</nav>

				<div className='mx-auto mt-8 flex max-w-3xl flex-col items-center justify-center gap-1 border-t border-primary-text-light/20 pt-6'>
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
					<p className='text-center text-xs text-primary-text-light'>
						&copy; {new Date().getFullYear()} {COMPANY.name}. Company No. {COMPANY.number}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
