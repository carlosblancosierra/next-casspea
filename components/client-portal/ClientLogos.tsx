import Image from 'next/image';

const initials = (name: string) =>
    name
        .split(/\s+/)
        .map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

/** The client's logo (or initials) next to the CassPea logo. */
export default function ClientLogos({ name, logo, brandColor }: { name: string; logo: string | null; brandColor: string }) {
    return (
        <div className="flex items-center gap-4">
            <div
                className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white text-2xl font-bold shadow"
                style={{ color: brandColor || undefined }}
            >
                {logo ? (
                    <Image src={logo} alt={name} fill sizes="80px" className="object-contain p-2" />
                ) : (
                    initials(name)
                )}
            </div>
            <span className="text-2xl font-light opacity-70">×</span>
            <div className="rounded-lg bg-white px-3 py-2 shadow">
                <Image src="/logos/black.png" alt="CassPea" width={112} height={32} className="h-auto w-28" />
            </div>
        </div>
    );
}
