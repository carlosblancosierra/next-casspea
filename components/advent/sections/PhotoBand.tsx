import Image from 'next/image';

interface Props {
    src: string;
    alt: string;
    /** Extra classes for the wrapper, e.g. `lg:hidden` or the side-by-side layout. */
    className?: string;
    imageClassName?: string;
    sizes?: string;
}

/**
 * One of the calendar's photos between two sections: full width, at its own
 * height, so nothing in it is cropped. Capped at 1200px on wide screens.
 */
export default function PhotoBand({
    src,
    alt,
    className = '',
    imageClassName = 'md:rounded-2xl',
    sizes = '(min-width: 1200px) 1200px, 100vw',
}: Props) {
    return (
        <div className={`mx-auto max-w-[1200px] pt-20 md:px-6 ${className}`}>
            <Image src={src} alt={alt} width={1200} height={1200} sizes={sizes} className={`h-auto w-full ${imageClassName}`} />
        </div>
    );
}
