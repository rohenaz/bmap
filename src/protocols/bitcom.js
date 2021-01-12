import { saveProtocolData } from '../utils';

const address = '$';

const querySchema = [
  {
    su: [
      { pubkey: 'string' },
      { sign_position: 'string' },
      { signature: 'string' },
    ],
    echo: [{ data: 'string' }, { to: 'string' }, { filename: 'string' }],
    route: [
      [
        {
          add: [
            { bitcom_address: 'string' },
            { route_matcher: 'string' },
            { endpoint_template: 'string' },
          ],
        },
        {
          enable: [{ path: 'string' }],
        },
      ],
    ],
    useradd: [{ address: 'string' }],
  },
];

// const handler = function (dataObj, protocolName, cell, tape, tx) {
const handler = function (dataObj, cell) {
  const bitcomObj = cell.map((c) => {
    return c && c.s ? c.s : '';
  });

  saveProtocolData(dataObj, 'BITCOM', bitcomObj);
};

export const BITCOM = {
  name: 'BITCOM',
  address,
  querySchema,
  handler,
};
