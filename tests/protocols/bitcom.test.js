import { describe, expect, beforeEach, afterEach, test, } from '@jest/globals';
import { BITCOM } from '../../src/protocols/bitcom';
import bitcomTransactions from '../data/bitcom-transactions.json';

describe('bitcom', () => {
  test('protocol definition', () => {
    expect(typeof BITCOM.name).toEqual('string');
    expect(typeof BITCOM.address).toEqual('string');
    expect(typeof BITCOM.querySchema).toEqual('object');
    expect(typeof BITCOM.handler).toEqual('function');
  });

  test('parse invalid tx', () => {
    const dataObj = {};
    const cell = '';
    const tx = {};
    expect(() => {
      BITCOM.handler(dataObj, cell, tx);
    }).toThrow();
  });

  test('parse useradd tx', () => {
    const dataObj = {};
    const cell = bitcomTransactions[0].out[0].tape[1].cell;
    const tape = bitcomTransactions[0].out[0].tape;
    const tx = bitcomTransactions[0];

    BITCOM.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.BITCOM).toEqual('object');
    expect(dataObj.BITCOM[0]).toEqual('$');
    expect(dataObj.BITCOM[1]).toEqual('useradd');
    expect(dataObj.BITCOM[2]).toEqual('188PLHvKNaEWHVZZFrX23maw5TtsnmgSSE');
  });

  test('parse echo tx', () => {
    const dataObj = {};
    const cell = bitcomTransactions[1].out[0].tape[1].cell;
    const tape = bitcomTransactions[1].out[0].tape;
    const tx = bitcomTransactions[1];

    BITCOM.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.BITCOM).toEqual('object');
    expect(dataObj.BITCOM[0]).toEqual('$');
    expect(dataObj.BITCOM[1]).toEqual('echo');
    expect(dataObj.BITCOM[2]).toEqual('genesis');
    expect(dataObj.BITCOM[3]).toEqual('to');
    expect(dataObj.BITCOM[4]).toEqual('name');
  });
});
