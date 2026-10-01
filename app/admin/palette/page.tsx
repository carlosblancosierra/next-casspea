'use client';

import { RequireAuth } from '@/components/utils';
import PalettePreview from '@/components/admin/PalettePreview';
import { palettes, ACTIVE } from '@/theme/palettes';

export default function PalettePage() {
    return (
        <RequireAuth>
            <div className="container mx-auto py-8">
                <h1 className="mb-2 text-2xl font-bold text-primary-text dark:text-primary-text-light">
                    Palette
                </h1>
                <p className="mb-6 max-w-2xl text-sm text-primary-text/70 dark:text-primary-text-light/70">
                    Three options drawn from the flavours artwork — the same greens, ochres, oranges and
                    rose, arranged differently. Each one is shown as swatches and as the controls it has
                    to survive, because a colour that reads fine as a square can still be unreadable as a
                    button.
                </p>
                <PalettePreview palettes={palettes} active={ACTIVE} />
            </div>
        </RequireAuth>
    );
}
