/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { supportedProtocols } from '../../src/bmap'
import { bmapjs } from '../../src/browser'
import { BobTx } from '../../types/common'
import bitcomTxs from '../data/bitcom-transactions.json'
import mapTransactions from '../data/map-transactions.json'

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

    test('test legacy TransformTx - BITCOM', async () => {
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

    test('test legacy TransformTx - PSP', async () => {
        // PSP is significant because it uses the paymail client which
        // required dns which is not available in the browser
        const bobTx = mapTransactions[0] as BobTx
        const { mocked } = jest.mock<bmapjs>('../../dist/bmap.cjs', () =>
            require('../../dist/bmap.cjs')
        )
        mocked(async (bmjs: bmapjs) => {
            expect(typeof bmjs).toBe('object')
            expect(typeof bmjs.TransformTx).toBe('object')
            expect(typeof bmjs.supportedProtocols).toBe('object')

            const pspTx = await bmjs.TransformTx(bobTx)

            if (pspTx) {
                expect(pspTx.PSP && typeof pspTx.PSP[0]).toEqual('object')
                expect(pspTx.PSP && pspTx.PSP[0].paymail).toEqual(
                    'hagbard@moneybutton.com'
                )
                expect(pspTx.PSP && pspTx.PSP[0].pubkey).toEqual(
                    '02c89b6790eb605062a31f124250594bd0fd02988da2541b3d25e7ef3937fb4ae0'
                )
                expect(pspTx.PSP && pspTx.PSP[0].signature).toEqual(
                    'INKFb15MnAXqNQny+b4KAVnGNtymG0dHSu13+871+ti0WN5FBeA/7DgUn1tlw6F7odbW7IDrVePKTLrTPAiDqyo='
                )
                expect(pspTx.PSP && pspTx.PSP[0].verified).toEqual(true)
            }
        })
    })
})
