/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { supportedProtocols } from '../../src/bmap'
import { bmapjs } from '../../src/browser'
import bitcomTxs from '../data/bitcom-transactions.json'

describe('bmapjs', () => {
    beforeEach(() => {
        jest.resetModules()
    })

    test('test require module', async () => {
        const { mocked } = jest.mock<bmapjs>('../../dist/bmap.module.js', () =>
            require('../../dist/bmap.module.js')
        )
        mocked((bmjs: bmapjs) => {
            expect(typeof bmjs).toBe('object')
            expect(typeof bmjs.TransformTx).toBe('object')
            expect(typeof bmjs.supportedProtocols).toBe('object')
        })
    })

    test('test require main', async () => {
        const { mocked } = jest.mock<bmapjs>('../../dist/bmap.js', () =>
            require('../../dist/bmap.js')
        )
        mocked((bmjs: bmapjs) => {
            expect(typeof bmjs).toBe('object')
            expect(typeof bmjs.TransformTx).toBe('object')
            expect(typeof bmjs.supportedProtocols).toBe('object')
        })
    })

    test('test main TransformTx', async () => {
        const bitcomTx = bitcomTxs[0]
        const { mocked } = jest.mock<bmapjs>('../../dist/bmap.js', () =>
            require('../../dist/bmap.js')
        )
        mocked(async (bmjs: bmapjs) => {
            expect(typeof bmjs).toBe('object')
            expect(typeof bmjs.TransformTx).toBe('object')
            expect(typeof bmjs.supportedProtocols).toBe('object')

            const bmapTx = await bmjs.TransformTx(bitcomTx)

            expect(typeof bmapTx).toBe('object')
            expect(typeof bmapTx.BITCOM).toBe('object')
            expect(supportedProtocols.every((p) => typeof p === 'string')).toBe(
                true
            )
        })
    })

    test('test require legacy', async () => {
        const { mocked } = jest.mock<bmapjs>('../../dist/bmap.cjs', () =>
            require('../../dist/bmap.cjs')
        )
        mocked((bmjs: bmapjs) => {
            expect(typeof bmjs).toBe('object')
            expect(typeof bmjs.TransformTx).toBe('object')
            expect(typeof bmjs.supportedProtocols).toBe('object')
        })
    })

    test('test legacy TransformTx', async () => {
        const bitcomTx = bitcomTxs[0]
        const { mocked } = jest.mock<bmapjs>('../../dist/bmap.cjs', () =>
            require('../../dist/bmap.cjs')
        )
        mocked(async (bmjs: bmapjs) => {
            expect(typeof bmjs).toBe('object')
            expect(typeof bmjs.TransformTx).toBe('object')
            expect(typeof bmjs.supportedProtocols).toBe('object')

            const bmapTx = await bmjs.TransformTx(bitcomTx)

            expect(typeof bmapTx).toBe('object')
            expect(typeof bmapTx.BITCOM).toBe('object')
            expect(supportedProtocols.every((p) => typeof p === 'string')).toBe(
                true
            )
        })
    })
})
