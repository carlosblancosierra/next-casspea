/**
 * Three steps, because there are three decisions: a size, the flavours (or
 * not), and delivery. It replaces the signature-boxes page's five-colour
 * numbered list, which split "pay" and "enjoy" into steps of their own and
 * made ordering look longer than it is.
 *
 * Step two leads with "keep our picks": the box arrives filled with the
 * bestsellers, and choosing every flavour is the option, not the chore.
 */

const STEPS = [
    {
        title: 'Pick your size',
        body: 'From a small thank-you to a showstopper. Every bonbon is hand-painted.',
    },
    {
        title: 'Keep our picks — or choose your own',
        body: 'We fill it with our bestsellers. Swap any flavour, or avoid nuts, gluten or alcohol.',
    },
    {
        title: 'We pack it, you gift it',
        body: 'Packed by hand in London and sent Royal Mail Tracked. Free delivery over £56.',
    },
];

export default function HowItWorks({ className = '' }: { className?: string }) {
    return (
        <ol className={`grid gap-4 md:grid-cols-3 ${className}`}>
            {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-3 rounded-xl bg-white/60 dark:bg-white/5 p-4">
                    <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-playfair text-lg font-bold text-accent-text"
                    >
                        {i + 1}
                    </span>
                    <div>
                        <h3 className="font-playfair text-lg font-bold text-primary-text dark:text-primary-text-light">{step.title}</h3>
                        <p className="mt-1 text-sm text-primary-text/80 dark:text-primary-text-light/80">{step.body}</p>
                    </div>
                </li>
            ))}
        </ol>
    );
}
