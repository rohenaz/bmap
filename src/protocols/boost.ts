import { BoostPowJob } from 'boostpow'
import { Cell } from 'bpu-ts'
import { HandlerProps, Protocol } from '../../types/common'
import { cellValue, saveProtocolData } from '../utils'

const protocolIdentifier = 'boostpow'

/*
{
    hash: '0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc',
    content: '00000000000000000000000000000000000000000048656c6c6f20776f726c64',
    bits: 486604799,
    difficulty: 1,
    metadataHash: "acd8278e84b037c47565df65a981d72fb09be5262e8783d4cf4e42633615962a",
    time: 1305200806,
    nonce: 3698479534,
    category: 1,
}
*/

const scriptChecker = (cell: Cell[]) => {
    // protocol identifier always in first pushdata
    return cell[0].s === protocolIdentifier
}

const handler = ({ dataObj, cell, out, tx }: HandlerProps): void => {
    if (!tx || !cell[0] || !out) {
        throw new Error(
            `Invalid BOOST tx. dataObj, cell, out and tx are required.`
        )
    }

    // build ASM from either op codes and script chunks
    const asm = cell
        .map((c) => (c.ops ? c.ops : cellValue(c, 'hex') || ''))
        .join(' ')

    if (asm) {
        const boostJob = BoostPowJob.fromASM(
            asm,
            tx.tx.h,
            out.i,
            out.e.v
        ).toObject()

        saveProtocolData(dataObj, 'BOOST', boostJob)
    }
}

export const BOOST: Protocol = {
    name: 'BOOST',
    handler,
    address: protocolIdentifier,
    scriptChecker,
}
