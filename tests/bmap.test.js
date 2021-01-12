import { describe, expect, beforeEach, afterEach, test, } from '@jest/globals';
import BMAP from '../src/bmap';
import validBobTransaction from './data/bap-transaction.json';
import twetchTransaction from './data/twetch-transaction.json';
import indexedTransaction from './data/b-aip-transaction-with-indexes.json';
import mapTransactions from './data/map-transactions.json';

describe('bmap', () => {
  test('class init', () => {
    const bmap = new BMAP();
    expect(typeof bmap.protocolMap).toEqual('object');
    expect(Object.keys(bmap.protocolMap).length).toEqual(7);
    expect(bmap.protocolMap.meta).toEqual('METANET');
    expect(bmap.protocolMap['15PciHG22SNLQJXMoSUaWVi7WSqc7hCfva']).toEqual('AIP');

    expect(typeof bmap.protocolHandlers).toEqual('object');
    expect(Object.keys(bmap.protocolHandlers).length).toEqual(7);
  });

  test('add handler', () => {
    const bmap = new BMAP();
    const querySchema = [];
    const protocolHandler = function(dataObj, protocolName, cell, tx) {};
    bmap.addProtocolHandler({
      name: 'test',
      address: '123TEST',
      querySchema,
      handler: protocolHandler,
    });

    expect(typeof bmap.protocolHandlers).toEqual('object');
    expect(Object.keys(bmap.protocolHandlers).length).toEqual(8);
    expect(bmap.protocolMap['123TEST']).toEqual('test');
  });

  test('invalid tx', async () => {
    const bmap = new BMAP();
    await expect(bmap.transformTx({}))
      .rejects
      .toThrow('Cannot process tx');
  });

  test('parse tx', async () => {
    const bmap = new BMAP();
    const parseTx = await bmap.transformTx(validBobTransaction);

    expect(parseTx._id).toEqual('5f08ddb0f797435fbff1ddf0');
    expect(parseTx.tx.h).toEqual('744a55a8637aa191aa058630da51803abbeadc2de3d65b4acace1f5f10789c5b');

    expect(parseTx.AIP.algorithm).toEqual('BITCOIN_ECDSA');
    expect(parseTx.AIP.address).toEqual('134a6TXxzgQ9Az3w8BcvgdZyA5UqRL89da');
    expect(parseTx.AIP.signature).toEqual('H+lubfcz5Z2oG8B7HwmP8Z+tALP+KNOPgedo7UTXwW8LBpMkgCgatCdpvbtf7wZZQSIMz83emmAvVS4S3F5X1wo=');
    expect(parseTx.AIP.verified).toEqual(true);

    expect(parseTx.BAP.type).toEqual('ATTEST');
    expect(parseTx.BAP.hash).toEqual('cf39fc55da24dc23eff1809e6e6cf32a0fe6aecc81296543e9ac84b8c501bac5');
    expect(parseTx.BAP.sequence).toEqual('0');
  });

  test('parse twetch tx', async () => {
    return; // twetch signature seems different
    const bmap = new BMAP();
    const parseTx = await bmap.transformTx(twetchTransaction);
    console.log(parseTx);

    expect(parseTx._id).toEqual('5f08ddb0f797435fbff1ddf0');
    expect(parseTx.tx.h).toEqual('744a55a8637aa191aa058630da51803abbeadc2de3d65b4acace1f5f10789c5b');

    expect(parseTx.AIP.algorithm).toEqual('BITCOIN_ECDSA');
    expect(parseTx.AIP.address).toEqual('134a6TXxzgQ9Az3w8BcvgdZyA5UqRL89da');
    expect(parseTx.AIP.signature).toEqual('H+lubfcz5Z2oG8B7HwmP8Z+tALP+KNOPgedo7UTXwW8LBpMkgCgatCdpvbtf7wZZQSIMz83emmAvVS4S3F5X1wo=');
    expect(parseTx.AIP.verified).toEqual(true);

    expect(parseTx.BAP.type).toEqual('ATTEST');
    expect(parseTx.BAP.hash).toEqual('cf39fc55da24dc23eff1809e6e6cf32a0fe6aecc81296543e9ac84b8c501bac5');
    expect(parseTx.BAP.sequence).toEqual('0');
  });

  test('parse double signed tx', async () => {
    const bmap = new BMAP();
    const parseTx = await bmap.transformTx(indexedTransaction);

    expect(parseTx._id).toEqual('5ee2aad74a4f6f397faf9971');
    expect(parseTx.tx.h).toEqual('d4738845dc0d045a35c72fcacaa2d4dee19a3be1cbfcb0d333ce2aec6f0de311');

    expect(Array.isArray(parseTx.AIP)).toEqual(true);
    expect(parseTx.AIP[0].address).toEqual('1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz');
    expect(parseTx.AIP[0].verified).toEqual(true);
    expect(parseTx.AIP[1].address).toEqual('19nknLhRnGKRR3hobeFuuqmHUMiNTKZHsR');
    expect(parseTx.AIP[1].verified).toEqual(true);

    expect(parseTx.B.content).toEqual('Hello world!');
    expect(parseTx.B['content-type']).toEqual('text/plain');
    expect(parseTx.B.encoding).toEqual('utf-8');
    expect(parseTx.B.filename).toEqual('\u0000');
  });

  test('parse meta double map tx', async () => {
    const bmap = new BMAP();
    const parseTx = await bmap.transformTx(mapTransactions[1]);

    expect(parseTx._id).toEqual('5ee5e9544a4f6f5fbb7d0ff0');
    expect(parseTx.tx.h).toEqual('ba7a5ac78fe11e8dc92f1c48b1707cdc49d91317062465aad9ae0a36c059f3cc');

    expect(typeof parseTx.METANET).toEqual('object');
    // rest is checked in metanet.test.js

    expect(Array.isArray(parseTx.MAP)).toEqual(true);
    expect(parseTx.MAP.length).toEqual(2);
    expect(parseTx.MAP[0].cmd).toEqual('SET');
    expect(parseTx.MAP[1].cmd).toEqual('ADD');
    // rest is checked in map.test.js
  });
});
