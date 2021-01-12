import { describe, expect, beforeEach, afterEach, test, } from '@jest/globals';
import { BAP } from '../../src/protocols/bap';
import validBobTransaction from '../data/bap-transaction.json';

describe('bap', () => {
  test('protocol definition', () => {
    expect(typeof BAP.name).toEqual('string');
    expect(typeof BAP.address).toEqual('string');
    expect(typeof BAP.querySchema).toEqual('object');
    expect(typeof BAP.handler).toEqual('function');
  });

  test('parse invalid tx', () => {
    const dataObj = {};
    const cell = '';
    const tx = {};
    expect(() => {
      BAP.handler(dataObj, cell, tx);
    }).toThrow();
  });

  test('parse tx', () => {
    const dataObj = {};
    const cell = validBobTransaction.out[0].tape[1].cell;
    const tx = {};
    BAP.handler(dataObj, cell, tx);
    expect(typeof dataObj.BAP).toEqual('object');
    expect(dataObj.BAP.type).toEqual('ATTEST');
    expect(dataObj.BAP.hash).toEqual('cf39fc55da24dc23eff1809e6e6cf32a0fe6aecc81296543e9ac84b8c501bac5');
    expect(dataObj.BAP.sequence).toEqual('0');
  });
});
