import type { Config } from 'jest'

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    displayName: 'Node Environment Tests',
    testMatch: ['<rootDir>/*.test.ts'],
}

export default config
