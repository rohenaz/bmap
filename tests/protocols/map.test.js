import {
  describe, expect, test
} from '@jest/globals';
import { MAP } from '../../src/protocols/map';
import mapTransactions from '../data/map-transactions.json';

describe('map', () => {
  test('protocol definition', () => {
    expect(typeof MAP.name).toEqual('string');
    expect(typeof MAP.address).toEqual('string');
    expect(typeof MAP.querySchema).toEqual('object');
    expect(typeof MAP.handler).toEqual('function');
  });

  test('parse invalid tx', () => {
    const dataObj = {};
    const cell = [];
    const tx = {};
    expect(() => {
      MAP.handler(dataObj, cell, tx);
    }).toThrow();
  });

  test('parse tx', () => {
    const dataObj = {};
    const { cell } = mapTransactions[0].out[0].tape[1];
    const { tape } = mapTransactions[0].out[0];
    const tx = mapTransactions[0];

    MAP.handler(dataObj, cell, tape, tx);
    expect(dataObj.MAP).toEqual({
      cmd: 'SET',
      app: '2paymail',
      paymail: 'hagbard@moneybutton.com',
      public_key: '02c89b6790eb605062a31f124250594bd0fd02988da2541b3d25e7ef3937fb4ae0',
      platform: 'twitter',
      proof_url: 'https://twitter.com/hagbarddd/status/1205189580309377024',
      proof_body: 'Hi\n\nMy paymail is hagbard@moneybutton.com',
      proof_id: 'Jk9vQgpdDpoW0qDY',
    });
  });

  test('parse tx 2', () => {
    const dataObj = {};
    const { cell } = mapTransactions[1].out[0].tape[3];
    const { tape } = mapTransactions[1].out[0];
    const tx = mapTransactions[1];

    MAP.handler(dataObj, cell, tape, tx);
    expect(dataObj.MAP).toEqual({
      cmd: 'SET',
      type: 'content',
      cost: 'free',
      encryption: 'secretbox',
      title: 'QMgkQwvfPSDSciCcBzMlKekCIyi7O8SrGIZT6fr0aHx608HjjGkAN12Wi+gXowdwXkvFAc9ElcCW5k+bDX2YVtTGnvQw7RG6DsAHcOcyrZFmt1SfftV+kU0bZtSuw7PUk6eTmO9vV7cfTjp1bJIqBkU50BE=',
      titleNonce: 'vY/G7emWqrVSvjwdSi6xwnlissY36PPC',
      hash: 'bfa3e480160ded9dfcb1547b09366ea50ed92943e68e60e17bf9df49c5f17eee',
      magicdata: '31465061787a5643464c6944654b7064427a76456b7268477a434c525241624c506f0a7c0a4d41500a5345540a706172656e740a323165383030393663323165326465353264373431616332373630376532353137373063306239663765363434663638346366333731373365383731383230650a6e616d6573706163650a37343333663836312d303631652d346630392d613730322d6432643135343733313462360a7c0a4d41500a4144440a746167730a4253560a417070730a4561726e696e67',
      app: 'Bit.sv',
      timestamp: '1586997452',
    });
  });

  test('parse tx 3', () => {
    const dataObj = {};
    const { cell } = mapTransactions[1].out[0].tape[4];
    const { tape } = mapTransactions[1].out[0];
    const tx = mapTransactions[1];

    MAP.handler(dataObj, cell, tape, tx);
    expect(dataObj.MAP).toEqual({
      cmd: 'ADD',
      tags: ['BSV', 'Apps', 'Earning'],
    });
  });

  test('parse REMOVE', () => {
    const dataObj = {};
    const { cell } = mapTransactions[2].out[0].tape[0];
    const { tape } = mapTransactions[2].out[0];
    const tx = mapTransactions[2];

    MAP.handler(dataObj, cell, tape, tx);
    expect(dataObj.MAP).toEqual({
      cmd: 'REMOVE',
      key: 'public_key',
    });
  });

  test('parse DELETE', () => {
    const dataObj = {};
    const { cell } = mapTransactions[3].out[0].tape[0];
    const { tape } = mapTransactions[3].out[0];
    const tx = mapTransactions[3];

    MAP.handler(dataObj, cell, tape, tx);
    expect(dataObj.MAP).toEqual({
      cmd: 'DELETE',
      public_key: [
        '02c89b6790eb605062a31f124250594bd0fd02988da2541b3d25e7ef3937fb4ae0',
      ],
    });
  });

  test('parse MSGPACK', () => {
    const dataObj = {};
    const { cell } = mapTransactions[4].out[0].tape[0];
    const { tape } = mapTransactions[4].out[0];
    const tx = mapTransactions[4];

    MAP.handler(dataObj, cell, tape, tx);
    expect(dataObj.MAP).toEqual({});
  });

  test('parse JSON', () => {
    const dataObj = {};
    const { cell } = mapTransactions[5].out[0].tape[0];
    const { tape } = mapTransactions[5].out[0];
    const tx = mapTransactions[5];

    MAP.handler(dataObj, cell, tape, tx);
    expect(dataObj.MAP).toEqual({});
  });
});

// TODO: Test bad B + MAP txs
// 'a970f70aad77704e55379ef22150c1bfd77232da5701959093d20cbe68fc1327',
// 'a970f70aad77704e55379ef22150c1bfd77232da5701959093d20cbe68fc1327',
// Bad Twetch '20df173a582d85b4bb337dc5e849daca6b10664aae3b6cb04dd7975eb2a99a12',
// Bad MAP JSON '4eedd926d8b8f32f11699e35d323aa102daf705543803c281b572ca559f435f6',
// Very bad MAP JSON '13b59940d3ad80b1203e20dadd54103a4343b39c93c700f20edd07d08bacd329',
