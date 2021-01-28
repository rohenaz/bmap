import { describe, expect, beforeEach, afterEach, test, } from '@jest/globals';
import { HAIP } from '../../src/protocols/haip';
import haipTransactions from '../data/haip-transactions.json'
import { PSP } from '../../src/protocols/psp';

describe('haip', () => {
  test('protocol definition', () => {
    expect(typeof HAIP.name).toEqual('string');
    expect(typeof HAIP.address).toEqual('string');
    expect(typeof HAIP.querySchema).toEqual('object');
    expect(typeof HAIP.handler).toEqual('function');
  });

  test('parse invalid tx', async () => {
    const dataObj = {};
    const cell = '';
    const tx = {};
    await expect(HAIP.handler(dataObj, cell, tx))
      .rejects
      .toThrow('AIP requires at least 4 fields including the prefix');
  });

  test('parse tx', async () => {
    const dataObj = {};
    const cell = haipTransactions[0].out[0].tape[2].cell;
    const tape = haipTransactions[0].out[0].tape;
    const tx = haipTransactions[0];
    await HAIP.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.HAIP).toEqual('object');
    expect(dataObj.HAIP.hashing_algorithm).toEqual('SHA256');
    expect(dataObj.HAIP.signing_algorithm).toEqual('BITCOIN_ECDSA');
    expect(dataObj.HAIP.signing_address).toEqual('1Ghayxcf8askMqL9EV9V9QpExTR2j6afhv');
    expect(dataObj.HAIP.signature).toEqual('H6Y5LXIZRaSQ0CJEt5eY1tbUhKTxII31MZwSpEYv5fqmZLzwuylAwrtHiI3lk3yCqf3Ib/Uv3LpAfCoNSKk68fY=');
    expect(dataObj.HAIP.verified).toEqual(true);
  });

  test('parse tx 2', async () => {
    const dataObj = {};
    const cell = haipTransactions[1].out[0].tape[2].cell;
    const tape = haipTransactions[1].out[0].tape;
    const tx = haipTransactions[1];
    await HAIP.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.HAIP).toEqual('object');
    expect(dataObj.HAIP.hashing_algorithm).toEqual('SHA256');
    expect(dataObj.HAIP.signing_algorithm).toEqual('BITCOIN_ECDSA');
    expect(dataObj.HAIP.signing_address).toEqual('1Ghayxcf8askMqL9EV9V9QpExTR2j6afhv');
    expect(dataObj.HAIP.signature).toEqual('IFh8jXM4pKa5W0GFZ3aE1PYer8Wwynv76OIyqslBXXj+MYxG52nIV1mVfOSgR/5ozTKOCjHHhmVyx/6EZ7q+NBs=');
    expect(dataObj.HAIP.verified).toEqual(true);
  });
});
