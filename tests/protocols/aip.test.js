import {
  describe, expect, test
} from '@jest/globals';
import { AIP } from '../../src/protocols/aip';
import indexedTransaction from '../data/b-aip-transaction-with-indexes.json';
import validBobTransaction from '../data/bap-transaction.json';
import unsignedBobTransaction from '../data/bap-unsigned-transaction.json';
import twetchTransaction from '../data/twetch-transaction.json';

describe('aip', () => {
  test('protocol definition', () => {
    expect(typeof AIP.name).toEqual('string');
    expect(typeof AIP.address).toEqual('string');
    expect(typeof AIP.querySchema).toEqual('object');
    expect(typeof AIP.handler).toEqual('function');
  });

  test('parse invalid tx', () => {
    const dataObj = {};
    const cell = '';
    const tx = {};
    expect(() => {
      AIP.handler(dataObj, cell, tx);
    }).toThrow();
  });

  test('parse tx', () => {
    const dataObj = {};
    const { cell } = validBobTransaction.out[0].tape[2];
    const { tape } = validBobTransaction.out[0];
    const tx = validBobTransaction;
    AIP.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.AIP).toEqual('object');
    expect(dataObj.AIP.algorithm).toEqual('BITCOIN_ECDSA');
    expect(dataObj.AIP.address).toEqual('134a6TXxzgQ9Az3w8BcvgdZyA5UqRL89da');
    expect(dataObj.AIP.signature).toEqual('H+lubfcz5Z2oG8B7HwmP8Z+tALP+KNOPgedo7UTXwW8LBpMkgCgatCdpvbtf7wZZQSIMz83emmAvVS4S3F5X1wo=');
    expect(dataObj.AIP.verified).toEqual(true);
  });

  test('parse twetch tx', () => {
    const dataObj = {};
    const { cell } = twetchTransaction.out[0].tape[2];
    const { tape } = twetchTransaction.out[0];
    const tx = twetchTransaction;
    AIP.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.AIP).toEqual('object');
    expect(dataObj.AIP.algorithm).toEqual('BITCOIN_ECDSA');
    expect(dataObj.AIP.address).toEqual('1LQKZfR4YMWPZ9FwktC4PSwCzR71VbyMEi');
    expect(dataObj.AIP.signature).toEqual('SUdhekhUTnhRL2kvL2pqa3lubGFJcjVqd0JkbFl0SFZXbEpRSWMwWTBZWCtIMkt2OHRtdjlyeE1nZjhTdHNablN2S1VLSzdLQ3BpbzZwQ1F6TjNvaWZzPQ==');
    // TODO: Twetch signatures do not seem to follow the AIP protocol definition, why ?
    expect(dataObj.AIP.verified).toEqual(false);
  });

  test('unsigned tx', () => {
    const dataObj = {};
    const { cell } = unsignedBobTransaction.out[0].tape[2];
    const { tape } = unsignedBobTransaction.out[0];
    const tx = unsignedBobTransaction;
    expect(() => {
      AIP.handler(dataObj, cell, tape, tx);
    }).toThrow();
  });

  test('indexed tx', () => {
    const dataObj = {};
    const { cell } = indexedTransaction.out[0].tape[2];
    const { tape } = indexedTransaction.out[0];
    const tx = indexedTransaction;
    AIP.handler(dataObj, cell, tape, tx);
    expect(dataObj.AIP.algorithm).toEqual('BITCOIN_ECDSA');
    expect(dataObj.AIP.address).toEqual('1EXhSbGFiEAZCE5eeBvUxT6cBVHhrpPWXz');
    expect(dataObj.AIP.signature).toEqual('HKzuHb43Xj4XpmK1YJROD/eN/58ZR0T7LuRi2QW8eFcnQg1d7tSy3QGQI/VQr09PeTQFAXniFyIFkqQYgvAlHvQ=');
    expect(dataObj.AIP.index).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(dataObj.AIP.verified).toEqual(true);
  });

  test('indexed tx - second AIP', () => {
    const dataObj = {};
    const { cell } = indexedTransaction.out[0].tape[3];
    const { tape } = indexedTransaction.out[0];
    const tx = indexedTransaction;
    AIP.handler(dataObj, cell, tape, tx);
    expect(dataObj.AIP.algorithm).toEqual('BITCOIN_ECDSA');
    expect(dataObj.AIP.address).toEqual('19nknLhRnGKRR3hobeFuuqmHUMiNTKZHsR');
    expect(dataObj.AIP.signature).toEqual('G0IShkx5mp0vHOt7To4UxcttlDo4BnG7xV3NaZkwNDy9Ht9iogRYn4o4T4lHZbS5iy4ay9Opr0kwB++FYk0tLFA=');
    expect(dataObj.AIP.index).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    expect(dataObj.AIP.verified).toEqual(true);
  });
});

// TODO:
// Add test for bad AIP: 'added2539ef771353b226a2e262f0c0b0ff4305bd9dfe81f900868d4297882d3'
