import { describe, expect, beforeEach, afterEach, test, } from '@jest/globals';
import { BITKEY } from '../../src/protocols/bitkey';
import bitkeyTransactions from '../data/bitkey-transactions.json';

describe('bitkey', () => {
  test('protocol definition', () => {
    expect(typeof BITKEY.name).toEqual('string');
    expect(typeof BITKEY.address).toEqual('string');
    expect(typeof BITKEY.querySchema).toEqual('object');
    expect(typeof BITKEY.handler).toEqual('function');
  });

  test('parse invalid tx', () => {
    const dataObj = {};
    const cell = '';
    const tx = {};
    expect(() => {
      BITKEY.handler(dataObj, cell, tx);
    }).toThrow();
  });

  test('parse tx', () => {
    const dataObj = {};
    const cell = bitkeyTransactions[0].out[0].tape[1].cell;
    const tape = bitkeyTransactions[0].out[0].tape;
    const tx = bitkeyTransactions[0];

    BITKEY.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.BITKEY).toEqual('object');
    expect(dataObj.BITKEY.bitkey_signature).toEqual('H+g5cgN6ILgrtoxSpt25ogVkOMuC6irp8Il7e5SGVrrkC2xZMIdCNwt8TPjbIG9ZTBDrVQujT0CeRWINpXXTRHU=');
    expect(dataObj.BITKEY.user_signature).toEqual('H+OgWIxuPUV18+FFl1sXvEQ0lZ2OsYbWf385F3ZnBPSxBo4X/2K94xuSbWwDIuD8DS4O98RywgkAzgEOxRhN6+4=');
    expect(dataObj.BITKEY.paymail).toEqual('644@moneybutton.com');
    expect(dataObj.BITKEY.pubkey).toEqual('03836714653ab7b17569be03eaf6593d59116700a226a3c812cc1f3b3c8f1cbd6c');
    // TODO: The bitkey_signature is not matching the bitkey server key 13SrNDkVzY5bHBRKNu5iXTQ7K7VqTh5tJC
    expect(dataObj.BITKEY.verified).toEqual(false);
  });
});
