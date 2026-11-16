import { isChunkLoadError, reloadOnceForChunkError } from '@/utils/chunkReload';

function memoryStorage() {
    const data = new Map<string, string>();
    return {
        getItem: (k: string) => data.get(k) ?? null,
        setItem: (k: string, v: string) => void data.set(k, v),
    } as unknown as Storage;
}

describe('chunk reload', () => {
    it('recognises the chunk errors PostHog reported', () => {
        const err = Object.assign(new Error('Loading chunk 5589 failed.\n(timeout: https://x/_next/static/chunks/5589.js)'), { name: 'ChunkLoadError' });
        expect(isChunkLoadError(err)).toBe(true);
        expect(isChunkLoadError(new Error('Loading chunk 739 failed.'))).toBe(true);
        expect(isChunkLoadError(new TypeError('Failed to fetch dynamically imported module: /x.js'))).toBe(true);
        expect(isChunkLoadError(new Error('Cannot read properties of null'))).toBe(false);
        expect(isChunkLoadError(undefined)).toBe(false);
    });

    it('reloads once, then not again within a minute', () => {
        const storage = memoryStorage();
        const reload = jest.fn();
        const err = new Error('Loading chunk 1 failed.');
        expect(reloadOnceForChunkError(err, { storage, reload, now: 1_000_000 })).toBe(true);
        expect(reloadOnceForChunkError(err, { storage, reload, now: 1_030_000 })).toBe(false);
        expect(reloadOnceForChunkError(err, { storage, reload, now: 1_061_000 })).toBe(true);
        expect(reload).toHaveBeenCalledTimes(2);
    });

    it('ignores other errors', () => {
        const reload = jest.fn();
        expect(reloadOnceForChunkError(new Error('boom'), { storage: memoryStorage(), reload })).toBe(false);
        expect(reload).not.toHaveBeenCalled();
    });
});
