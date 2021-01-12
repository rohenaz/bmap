import { describe, expect, beforeEach, afterEach, test, } from '@jest/globals';
import { BITPIC } from '../../src/protocols/bitpic';
import bitpicTransactions from '../data/b-bitpic-transactions.json';

describe('bitpic', () => {
  test('protocol definition', () => {
    expect(typeof BITPIC.name).toEqual('string');
    expect(typeof BITPIC.address).toEqual('string');
    expect(typeof BITPIC.querySchema).toEqual('object');
    expect(typeof BITPIC.handler).toEqual('function');
  });

  test('parse invalid tx', () => {
    const dataObj = {};
    const cell = '';
    const tx = {};
    expect(() => {
      BITPIC.handler(dataObj, cell, tx);
    }).toThrow();
  });

  test('parse tx', () => {
    const dataObj = {};
    const cell = bitpicTransactions[0].out[0].tape[2].cell;
    const tape = bitpicTransactions[0].out[0].tape;
    const tx = bitpicTransactions[0];

    BITPIC.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.BITPIC).toEqual('object');
    expect(dataObj.BITPIC.paymail).toEqual('644@moneybutton.com');
    expect(dataObj.BITPIC.pubkey).toEqual('03836714653ab7b17569be03eaf6593d59116700a226a3c812cc1f3b3c8f1cbd6c');
    expect(dataObj.BITPIC.signature).toEqual('SUpBTHhHdFgyS3MrWGlCQ2h2UXZOWHN2Vkg1RUJGblVYRkx2ckZzVVRQd3RLcmtmUFRaaldSODhtMlJJa1cwb0VxaEtxaDFKa3FiQUZtL0c5U2JzQS8wPQ==');
    //expect(dataObj.BITPIC.verified).toEqual(true);
  });
});
