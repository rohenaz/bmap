import type { Config } from 'jest'

const config: Config = {
    preset: 'ts-jest',
    displayName: 'Core Protocol Tests',
    testEnvironment: 'node',
    testMatch: ['../*.test.ts'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
}

export default config
