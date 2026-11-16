import { TextEncoder } from 'util';
import React, { act } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { useHydrated } from '@/hooks/useHydrated';

// react-dom/server needs TextEncoder, which jsdom does not provide.
Object.assign(global, { TextEncoder, IS_REACT_ACT_ENVIRONMENT: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { renderToString } = require('react-dom/server');

/** Stands in for an RTK Query cache that already has data when this hydrates. */
let liveData: string | undefined;

function Gated() {
    const hydrated = useHydrated();
    return <span>{(hydrated && liveData) || 'snapshot'}</span>;
}
function Ungated() {
    return <span>{liveData ?? 'snapshot'}</span>;
}

async function hydrate(Component: React.FC) {
    liveData = undefined;
    const container = document.createElement('div');
    container.innerHTML = renderToString(<Component />);
    liveData = 'live';
    const errors = jest.spyOn(console, 'error').mockImplementation(() => {});
    await act(async () => {
        hydrateRoot(container, <Component />, { onRecoverableError: e => console.error(e) });
    });
    const hydrationErrors = errors.mock.calls.filter(c => /hydrat|did not match/i.test(String(c[0])));
    errors.mockRestore();
    return { text: container.textContent, hydrationErrors };
}

describe('useHydrated', () => {
    it('reproduces the bug: live data during hydration does not match the HTML', async () => {
        const { hydrationErrors } = await hydrate(Ungated);
        expect(hydrationErrors.length).toBeGreaterThan(0);
    });

    it('gating on it hydrates cleanly, then shows the live data', async () => {
        const { text, hydrationErrors } = await hydrate(Gated);
        expect(hydrationErrors).toHaveLength(0);
        expect(text).toBe('live');
    });
});
