import type { Config } from 'jest'

const config: Config = {
    preset: 'ts-jest',
    displayName: 'Core Protocol Tests',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/*.test.ts'],
}

export default config
