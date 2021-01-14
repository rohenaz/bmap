import { describe, expect, beforeEach, afterEach, test, } from '@jest/globals';
import { HAIP } from '../../src/protocols/haip';
import haipTransactions from '../data/haip-transactions.json'

describe('haip', () => {
  test('protocol definition', () => {
    expect(typeof HAIP.name).toEqual('string');
    expect(typeof HAIP.address).toEqual('string');
    expect(typeof HAIP.querySchema).toEqual('object');
    expect(typeof HAIP.handler).toEqual('function');
  });

  test('parse invalid tx', () => {
    const dataObj = {};
    const cell = '';
    const tx = {};
    expect(() => {
      HAIP.handler(dataObj, cell, tx);
    }).toThrow();
  });

  // TODO: need test data
  test('parse tx', () => {
    const dataObj = {};
    const cell = haipTransactions[0].out[0].tape[2].cell;
    const tape = haipTransactions[0].out[0].tape;
    const tx = haipTransactions[0];
    HAIP.handler(dataObj, cell, tape, tx);
    //console.log(dataObj);
    expect(typeof dataObj.HAIP).toEqual('object');
    expect(dataObj.HAIP.hashing_algorithm).toEqual('SHA256');
    expect(dataObj.HAIP.signing_algorithm).toEqual('BITCOIN_ECDSA');
    expect(dataObj.HAIP.signing_address).toEqual('1Ghayxcf8askMqL9EV9V9QpExTR2j6afhv');
    expect(dataObj.HAIP.signature).toEqual('SDZZNUxYSVpSYVNRMENKRXQ1ZVkxdGJVaEtUeElJMzFNWndTcEVZdjVmcW1aTHp3dXlsQXdydEhpSTNsazN5Q3FmM0liL1V2M0xwQWZDb05TS2s2OGZZPQ==');
    // TODO: HAIP signatures are not verifying
    //expect(dataObj.HAIP.verified).toEqual(true);
  });
});
