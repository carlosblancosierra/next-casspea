const nextJest = require('next/jest');

// The shop, its posting cut-offs and nearly every customer are on London time.
// CI machines run in UTC, where British Summer Time does not exist and every
// "off by one day in summer" bug stays invisible (see BUG-06 in
// docs/plan-rediseno-seguro.md). Set here, before Jest starts its workers.
process.env.TZ = 'Europe/London';

const createJestConfig = nextJest({
	// Load next.config.js and .env files in the test environment
	dir: './',
});

/** @type {import('jest').Config} */
const config = {
	testEnvironment: 'jest-environment-jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},
	testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/e2e/'],
};

module.exports = createJestConfig(config);
