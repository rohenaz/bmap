import { describe, expect, beforeEach, afterEach, test, } from '@jest/globals';
import { PSP } from '../../src/protocols/psp';
import mapTransactions from '../data/map-transactions.json';

describe('bitpic', () => {
  test('protocol definition', () => {
    expect(typeof PSP.name).toEqual('string');
    expect(typeof PSP.address).toEqual('string');
    expect(typeof PSP.querySchema).toEqual('object');
    expect(typeof PSP.handler).toEqual('function');
  });

  test('parse invalid tx', async () => {
    const dataObj = {};
    const cell = '';
    const tx = {};
    await expect(PSP.handler(dataObj, cell, tx))
      .rejects
      .toThrow('Cannot read property \'s\' of undefined');
  });

  test('parse tx', async () => {
    const dataObj = {};
    const cell = mapTransactions[0].out[0].tape[2].cell;
    const tape = mapTransactions[0].out[0].tape;
    const tx = mapTransactions[0];

    await PSP.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.PSP).toEqual('object');
    expect(dataObj.PSP.paymail).toEqual('hagbard@moneybutton.com');
    expect(dataObj.PSP.pubkey).toEqual('02c89b6790eb605062a31f124250594bd0fd02988da2541b3d25e7ef3937fb4ae0');
    expect(dataObj.PSP.signature).toEqual('INKFb15MnAXqNQny+b4KAVnGNtymG0dHSu13+871+ti0WN5FBeA/7DgUn1tlw6F7odbW7IDrVePKTLrTPAiDqyo=');
    expect(dataObj.PSP.verified).toEqual(true);
  });
});
