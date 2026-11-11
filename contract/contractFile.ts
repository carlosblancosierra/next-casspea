import fs from 'fs';
import path from 'path';

/**
 * The files in contract/ are the agreements this storefront has with the
 * outside world: the API calls it makes, the URLs it serves, and the links
 * that other systems (Stripe, emails) send people to. Tests compare the live
 * code with them, so a redesign cannot change any of it by accident.
 *
 * To accept a deliberate change, regenerate and review the diff:
 *
 *     UPDATE_CONTRACT=1 pnpm test contract
 */
export const CONTRACT_DIR = __dirname;

export const isUpdatingContract = () => process.env.UPDATE_CONTRACT === '1';

export function readContractFile<T>(file: string): T {
    return JSON.parse(fs.readFileSync(path.join(CONTRACT_DIR, file), 'utf8')) as T;
}

/** Compare with the committed file, or rewrite it when UPDATE_CONTRACT=1. */
export function expectMatchesContractFile(file: string, actual: unknown): void {
    if (isUpdatingContract()) {
        fs.writeFileSync(path.join(CONTRACT_DIR, file), `${JSON.stringify(actual, null, 2)}\n`);
        return;
    }
    expect(actual).toEqual(readContractFile(file));
}
