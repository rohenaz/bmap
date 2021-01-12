import { describe, expect, beforeEach, afterEach, test, } from '@jest/globals';
import { SYMRE } from '../../src/protocols/symre';
import symreTransactions from '../data/symre-haip-transactions.json';

describe('symre', () => {
  test('protocol definition', () => {
    expect(typeof SYMRE.name).toEqual('string');
    expect(typeof SYMRE.address).toEqual('string');
    expect(typeof SYMRE.querySchema).toEqual('object');
    expect(typeof SYMRE.handler).toEqual('function');
  });

  test('parse invalid tx', () => {
    const dataObj = {};
    const cell = '';
    const tx = {};
    expect(() => {
      SYMRE.handler(dataObj, cell, tx);
    }).toThrow();
  });

  test('parse tx', () => {
    const dataObj = {};
    const cell = symreTransactions[0].out[0].tape[1].cell;
    const tape = symreTransactions[0].out[0].tape;
    const tx = symreTransactions[0];

    SYMRE.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.SYMRE).toEqual('object');
    expect(dataObj.SYMRE.url).toEqual('https://medium.com/@Stas33496115/bitcoin-script-engineering-part-ii-ba8095f093c0');
  });
});
