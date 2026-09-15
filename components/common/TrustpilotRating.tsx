import Image from 'next/image';

interface Props {
    className?: string;
    /**
     * Colour of the link text. Defaults to the theme-paired tokens, which is
     * what is needed on a normal page background. Pass an override when placing
     * this on a fixed-colour surface (e.g. the teal announcement bar).
     */
    linkClassName?: string;
}

export default function TrustpilotRating({
    className = '',
    linkClassName = 'text-primary-text dark:text-primary-text-light',
}: Props) {
    return (
        <div className={`flex items-center gap-x-2 justify-center ${className}`}>
            <Image
                src="/home/stars-4.5.svg"
                alt="Trustpilot rating 4.7 out of 5"
                width={100}
                height={100}
                className="inline-block"
            />
            <a
                href="https://uk.trustpilot.com/review/www.casspea.co.uk"
                className={`text-sm font-medium inline-block hover:underline ${linkClassName}`}
                rel="noopener noreferrer"
                target="_blank"
            >
                4.7 on Trustpilot (74 reviews)
            </a>
        </div>
    );
}
