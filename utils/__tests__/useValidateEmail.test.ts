import { useValidateEmail as validateEmail } from '@/utils/useValidateEmail';

describe('validateEmail', () => {
    it.each([
        'user@example.com',
        'first.last@sub.domain.co.uk',
        'user+tag@example.io',
    ])('accepts %s', (email) => {
        expect(validateEmail(email)).toBe(true);
    });

    it.each([
        '',
        'plainaddress',
        'user@',
        '@example.com',
        'user@example',
        'user name@example.com',
        'user@exam ple.com',
    ])('rejects %s', (email) => {
        expect(validateEmail(email)).toBe(false);
    });
});
