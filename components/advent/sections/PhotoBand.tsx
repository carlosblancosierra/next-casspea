import Image from 'next/image';

/**
 * One of the calendar's photos between two sections: full width, at its own
 * height, so nothing in it is cropped. Capped at 1200px on wide screens.
 */
export default function PhotoBand({ src, alt }: { src: string; alt: string }) {
    return (
        <div className="mx-auto max-w-[1200px] pt-20 md:px-6">
            <Image
                src={src}
                alt={alt}
                width={1200}
                height={1200}
                sizes="(min-width: 1200px) 1200px, 100vw"
                className="h-auto w-full md:rounded-2xl"
            />
        </div>
    );
}
