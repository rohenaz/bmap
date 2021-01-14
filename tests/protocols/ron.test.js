import { describe, expect, beforeEach, afterEach, test, } from '@jest/globals';
import { RON } from '../../src/protocols/ron';
import ronTransactions from '../data/ron-transactions.json';

describe('ron', () => {
  test('protocol definition', () => {
    expect(typeof RON.name).toEqual('string');
    expect(typeof RON.address).toEqual('string');
    expect(typeof RON.querySchema).toEqual('object');
    expect(typeof RON.handler).toEqual('function');
  });

  test('parse invalid tx', () => {
    const dataObj = {};
    const cell = '';
    const tx = {};
    expect(() => {
      RON.handler(dataObj, cell, tx);
    }).toThrow();
  });

  test('parse tx', () => {
    const dataObj = {};
    const cell = ronTransactions[0].out[1].tape[1].cell;
    const tape = ronTransactions[0].out[1].tape;
    const tx = ronTransactions[0];

    RON.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.RON).toEqual('object');
    expect(dataObj.RON.pair).toEqual({ USDZAR: '14.751981' });
    expect(dataObj.RON.address).toEqual('1DRfVXbQTATHefCHTSKxniEEHySTi7CvKH');
    expect(dataObj.RON.timestamp).toEqual(1574689916);
  });
});
