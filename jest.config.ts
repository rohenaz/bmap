import type { Config } from '@jest/types'
import { defaults } from 'jest-config'

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    verbose: true,
    projects: [
        '<rootDir>/tests/node/jest.config.ts',
        '<rootDir>/tests/protocols/jest.config.ts',
    ],
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
}
export default config
