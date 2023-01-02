import type { Config } from 'jest'

const config: Config = {
    preset: 'ts-jest',
    displayName: 'Browser Environment Tests',
    testEnvironment: 'jsdom',
    testMatch: ['**/tests/browser/*.test.ts'],
}

export default config
