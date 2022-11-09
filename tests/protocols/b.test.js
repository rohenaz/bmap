import { describe, expect, test } from '@jest/globals';
import { B } from '../../src/protocols/b';
import indexedTransaction from '../data/b-aip-transaction-with-indexes.json';
import badFieldsTransaction from '../data/b-bad-fields-transaction.json';
import bitpicTransactions from '../data/b-bitpic-transactions.json';
import mapTransactions from '../data/map-transactions.json';
import bSocial from '../data/bsocial-2-b-outputs.json';
import { AIP } from '../../src/protocols/aip';

describe('b', () => {
  test('protocol definition', () => {
    expect(typeof B.name).toEqual('string');
    expect(typeof B.address).toEqual('string');
    expect(typeof B.querySchema).toEqual('object');
    expect(typeof B.handler).toEqual('function');
  });

  test('parse invalid tx', () => {
    const dataObj = {};
    const cell = '';
    const tx = {};
    expect(() => {
      B.handler(dataObj, cell, tx);
    }).toThrow();
  });

  test('parse tx', () => {
    const dataObj = {};
    const { cell } = indexedTransaction.out[0].tape[1];
    const { tape } = indexedTransaction.out[0];
    const tx = indexedTransaction;

    B.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.B).toEqual('object');
    expect(dataObj.B.content).toEqual('Hello world!');
    expect(dataObj.B['content-type']).toEqual('text/plain');
    expect(dataObj.B.encoding).toEqual('utf-8');
    expect(dataObj.B.filename).toEqual('\u0000');
  });

  test('parse tx without encoding', () => {
    const dataObj = {};
    const cell = JSON.parse(JSON.stringify(indexedTransaction.out[0].tape[1].cell));
    // remove encoding, parser should try to infer
    cell[3].s = '';
    cell[3].h = '';
    cell[3].b = '';
    const { tape } = indexedTransaction.out[0];
    const tx = indexedTransaction;

    B.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.B).toEqual('object');
    expect(dataObj.B.content).toEqual('Hello world!');
    expect(dataObj.B['content-type']).toEqual('text/plain');
    expect(dataObj.B.encoding).toEqual('utf-8');
    expect(dataObj.B.filename).toEqual('\u0000');
  });

  test('parse tx with too many fields for schema', () => {
    // too many fields for schema, should warn
    const dataObj = {};
    const tx = badFieldsTransaction;
    const { tape } = tx.out[0];
    const cell = JSON.parse(JSON.stringify(tape[1].cell));
    expect(() => {
      B.handler(dataObj, cell, tape, tx);
    }).toThrow();
  });

  test('parse tx without filename', () => {
    const dataObj = {};
    const cell = JSON.parse(JSON.stringify(indexedTransaction.out[0].tape[1].cell));
    // remove encoding, parser should try to infer
    cell[4].s = '';
    cell[4].h = '';
    cell[4].b = '';
    const { tape } = indexedTransaction.out[0];
    const tx = indexedTransaction;

    B.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.B).toEqual('object');
    expect(dataObj.B.content).toEqual('Hello world!');
    expect(dataObj.B['content-type']).toEqual('text/plain');
    expect(dataObj.B.encoding).toEqual('utf-8');
    expect(dataObj.B.filename).toEqual('');
  });

  test('parse bitpic', () => {
    const dataObj = {};
    const tx = bitpicTransactions[0];
    const { tape } = tx.out[0];
    const { cell } = tape[1];
    B.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.B).toEqual('object');
    expect(dataObj.B.content).toEqual('bitfs://7fde64ea6989985719b72032c77fd2042428fb2f94958fdbba1ec2ae8044e5cc.out.0.3');
    expect(dataObj.B['content-type']).toEqual('image/jpeg');
    expect(dataObj.B.encoding).toEqual('binary');
    expect(dataObj.B.filename).toEqual(undefined);
  });

  test('bsocial tx with image', () => {
    const dataObj = {};
    const tx = mapTransactions[7];
    const { tape } = tx.out[0];
    const { cell } = tape[1];
    B.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.B).toEqual('object');
    expect(dataObj.B.content).toEqual('bitfs://868e663652556fa133878539b6c65093e36bef1a6497e511bdf0655b2ce1c935.out.0.3');
    expect(dataObj.B['content-type']).toEqual('image/jpeg');
    expect(dataObj.B.encoding).toEqual(undefined);
    expect(dataObj.B.filename).toEqual(undefined);
  });

  test('bsocial tx with image - no encoding', () => {
    const dataObj = {};
    const tx = bSocial[0];
    const { tape } = tx.out[0];
    const { cell } = tape[2];
    B.handler(dataObj, cell, tape, tx);
    expect(typeof dataObj.B).toEqual('object');
    expect(dataObj.B.content).toEqual('');
    expect(dataObj.B['content-type']).toEqual('image/png');
    expect(dataObj.B.encoding).toEqual('binary');
    expect(dataObj.B.filename).toEqual(undefined);
  });
});
