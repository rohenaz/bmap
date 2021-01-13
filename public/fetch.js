const load = async (ex) => {
  const examples = ex;
  const momToggle = document.querySelector('#momToggle');

  function useMom() {
    return localStorage.getItem('useMom') === 'true';
  }

  function updateMomToggle() {
    momToggle.innerHTML = 'Switch to ' + (!useMom() ? 'MOM' : 'BOB');
  }

  // let rawBob = {
  //   tx: {
  //     h: '4a0b56c70944c4b5886e424a66b0080e59fb59b430c5969e16040cb496864b04',
  //   },
  //   in: [
  //     {
  //       i: 0,
  //       tape: [
  //         {
  //           cell: [
  //             {
  //               b:
  //                 'MEQCIHx5XYGD3Ym9oi9/SrkThYZAYiGWe478AUJofOGeFLAdAiAIQdi5I5WsOha7SWbOxcwDF3GP193zu9kUnJ+rm9uILUE=',
  //               s:
  //                 '0D\u0002 |y]��݉��/J�\u0013��@b!�{��\u0001Bh|�\u0014�\u001d\u0002 \bAع#��:\u0016�If���\u0003\u0017q�����\u0014����ۈ-A',
  //               ii: 0,
  //               i: 0,
  //             },
  //             {
  //               b: 'A4nEboIjrxrvLtPaKT9YFd/qQh/3q+VPu+PmF2vXMyFw',
  //               s:
  //                 '\u0003��n�#�\u001a�.��)?X\u0015��B\u001f���O���\u0017k�3!p',
  //               ii: 1,
  //               i: 1,
  //             },
  //           ],
  //           i: 0,
  //         },
  //       ],
  //       e: {
  //         h:
  //           '7e30bc6eb34b613465619947b7e3f1addd279cd40f0da0ad952c60357cfbc6fa',
  //         i: 3,
  //         a: '17VtU2C45UxEqDyoJdifrHa2mocpm7zYjH',
  //       },
  //       seq: 4294967295,
  //     },
  //     {
  //       i: 1,
  //       tape: [
  //         {
  //           cell: [
  //             {
  //               b:
  //                 'MEUCIQCxU/DA97AwWlxVZqh+D5Udc4AIIp09BVBKiYyGUcCnAQIgaGt4r0inKIe7E/xPfFnp24hkY80oSab1XstJyhwCqQBB',
  //               s:
  //                 '0E\u0002!\u0000�S����0Z\\Uf�~\u000f�\u001ds�\b"�=\u0005PJ���Q��\u0001\u0002 hkx�H�(��\u0013�O|Y�ۈdc�(I��^�I�\u001c\u0002�\u0000A',
  //               ii: 0,
  //               i: 0,
  //             },
  //             {
  //               b: 'A4nEboIjrxrvLtPaKT9YFd/qQh/3q+VPu+PmF2vXMyFw',
  //               s:
  //                 '\u0003��n�#�\u001a�.��)?X\u0015��B\u001f���O���\u0017k�3!p',
  //               ii: 1,
  //               i: 1,
  //             },
  //           ],
  //           i: 0,
  //         },
  //       ],
  //       e: {
  //         h:
  //           '7e30bc6eb34b613465619947b7e3f1addd279cd40f0da0ad952c60357cfbc6fa',
  //         i: 4,
  //         a: '17VtU2C45UxEqDyoJdifrHa2mocpm7zYjH',
  //       },
  //       seq: 4294967295,
  //     },
  //   ],
  //   out: [
  //     {
  //       i: 0,
  //       tape: [
  //         {
  //           cell: [
  //             {
  //               op: 0,
  //               ops: 'OP_0',
  //               ii: 0,
  //               i: 0
  //             },
  //             {
  //               op: 106,
  //               ops: 'OP_RETURN',
  //               ii: 1,
  //               i: 1
  //             },
  //             {
  //               b: 'MVB1UWE3SzYyTWlLQ3Rzc1NMS3kxa2g1NldXVTdNdFVSNQ==',
  //               s: '1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5',
  //               ii: 2,
  //               i: 2,
  //             },
  //             {
  //               b: 'U0VU',
  //               s: 'SET',
  //               ii: 3,
  //               i: 3
  //             },
  //             {
  //               b: 'YXBw',
  //               s: 'app',
  //               ii: 4,
  //               i: 4
  //             },
  //             {
  //               b: 'bWluZXJ2YQ==',
  //               s: 'minerva',
  //               ii: 5,
  //               i: 5
  //             },
  //             {
  //               b: 'dHlwZQ==',
  //               s: 'type',
  //               ii: 6,
  //               i: 6
  //             },
  //             {
  //               b: 'dmlkZW8=',
  //               s: 'video',
  //               ii: 7,
  //               i: 7
  //             },
  //             {
  //               b: 'cHJvdmlkZXI=',
  //               s: 'provider',
  //               ii: 8,
  //               i: 8
  //             },
  //             {
  //               b: 'eW91dHViZQ==',
  //               s: 'youtube',
  //               ii: 9,
  //               i: 9
  //             },
  //             {
  //               b: 'dmlkZW9JRA==',
  //               s: 'videoID',
  //               ii: 10,
  //               i: 10
  //             },
  //             {
  //               b: 'emV3eXZRRXFzUzQ=',
  //               s: 'zewyvQEqsS4',
  //               ii: 11,
  //               i: 11
  //             },
  //             {
  //               b: 'ZHVyYXRpb24=',
  //               s: 'duration',
  //               ii: 12,
  //               i: 12
  //             },
  //             {
  //               b: 'MTY5',
  //               s: '169',
  //               ii: 13,
  //               i: 13
  //             },
  //             {
  //               b: 'c3RhcnQ=',
  //               s: 'start',
  //               ii: 14,
  //               i: 14
  //             },
  //             {
  //               b: 'MA==',
  //               s: '0',
  //               ii: 15,
  //               i: 15
  //             },
  //             {
  //               b: 'Y29udGV4dA==',
  //               s: 'context',
  //               ii: 16,
  //               i: 16
  //             },
  //             {
  //               b: 'dmlkZW9JRA==',
  //               s: 'videoID',
  //               ii: 17,
  //               i: 17
  //             },
  //             {
  //               b: 'c3ViY29udGV4dA==',
  //               s: 'subcontext',
  //               ii: 18,
  //               i: 18
  //             },
  //             {
  //               b: 'cHJvdmlkZXI=',
  //               s: 'provider',
  //               ii: 19,
  //               i: 19
  //             },
  //             {
  //               b: 'fA==',
  //               s: '|',
  //               ii: 20,
  //               i: 20
  //             },
  //             {
  //               b: 'MTVpZ0NoRWtVV2d4NGRzRWNTdVBpdGNMTlptTkRmVXZnQQ==',
  //               s: '15igChEkUWgx4dsEcSuPitcLNZmNDfUvgA',
  //               ii: 21,
  //               i: 21,
  //             },
  //             {
  //               b:
  //                 'ZWRmNmZmM2EzMDBhOTZlYTE2ZmI5ZGMzZjA3YjkzODQwY2EwYjk0ZjM1ZTdjZTliNTY3MjI2ODRmYWJmNTc2OA==',
  //               s:
  //                 'edf6ff3a300a96ea16fb9dc3f07b93840ca0b94f35e7ce9b56722684fabf5768',
  //               ii: 22,
  //               i: 22,
  //             },
  //             {
  //               b:
  //                 'SDNvU1Q3OTdDWDlSVmtVSHk2QldyalRrMk94aExhbWFBMUo4Q2ZDL1Y2SWpKM1BrNUFpdTZjdTE5NGd6bFZxa01CME8yL1BHaC9vWWdTcjhqVDhKQ0NRPQ==',
  //               s:
  //                 'H3oST797CX9RVkUHy6BWrjTk2OxhLamaA1J8CfC/V6IjJ3Pk5Aiu6cu194gzlVqkMB0O2/PGh/oYgSr8jT8JCCQ=',
  //               ii: 23,
  //               i: 23,
  //             },
  //             {
  //               b: 'Ar2rUhi8D442diOa26+PlcroBf2Itrj35Uuc6ks82l0J',
  //               s: '\u0002��R\u0018�\u000f�6v#�ۯ����\u0005������K��K<�]\t',
  //               ii: 24,
  //               i: 24,
  //             },
  //             {
  //               b: 'bHVrZUByZWxheXguaW8=',
  //               s: 'luke@relayx.io',
  //               ii: 25,
  //               i: 25,
  //             },
  //           ],
  //           i: 0,
  //         },
  //       ],
  //       e: {
  //         v: 0,
  //         i: 0,
  //         a: 'false'
  //       },
  //     },
  //     {
  //       i: 1,
  //       tape: [
  //         {
  //           cell: [
  //             {
  //               op: 0,
  //               ops: 'OP_0',
  //               ii: 0,
  //               i: 0
  //             },
  //             {
  //               op: 106,
  //               ops: 'OP_RETURN',
  //               ii: 1,
  //               i: 1
  //             },
  //             {
  //               b: 'MVB1UWE3SzYyTWlLQ3Rzc1NMS3kxa2g1NldXVTdNdFVSNQ==',
  //               s: '1PuQa7K62MiKCtssSLKy1kh56WWU7MtUR5',
  //               ii: 2,
  //               i: 2,
  //             },
  //             {
  //               b: 'QURE',
  //               s: 'ADD',
  //               ii: 3,
  //               i: 3
  //             },
  //             {
  //               b: 'dGFncw==',
  //               s: 'tags',
  //               ii: 4,
  //               i: 4
  //             },
  //             {
  //               b: 'c3BhY2U=',
  //               s: 'space',
  //               ii: 5,
  //               i: 5
  //             },
  //             {
  //               b: 'fA==',
  //               s: '|',
  //               ii: 6,
  //               i: 6
  //             },
  //             {
  //               b: 'MTVpZ0NoRWtVV2d4NGRzRWNTdVBpdGNMTlptTkRmVXZnQQ==',
  //               s: '15igChEkUWgx4dsEcSuPitcLNZmNDfUvgA',
  //               ii: 7,
  //               i: 7,
  //             },
  //             {
  //               b:
  //                 'NDg4ZmMwNjI0M2E3MGJjMTFmNDI2YTNlNTFiYTBiNmEwMzE0ZGFhYTY2MDM1YWJiZTUzMTcxYWQ1YTQ4NGQwMQ==',
  //               s:
  //                 '488fc06243a70bc11f426a3e51ba0b6a0314daaa66035abbe53171ad5a484d01',
  //               ii: 8,
  //               i: 8,
  //             },
  //             {
  //               b:
  //                 'SUxrMUJ6S1VVekFxNzN6L3BIdzZISStiRFNVdzFPenAzM0xYRDlrSEdNV2VWUzdtTWdta3F2ZG9TT1VRTUFESTd5emp0OVJpWCs4c05ncWUyaVFlY1NJPQ==',
  //               s:
  //                 'ILk1BzKUUzAq73z/pHw6HI+bDSUw1Ozp33LXD9kHGMWeVS7mMgmkqvdoSOUQMADI7yzjt9RiX+8sNgqe2iQecSI=',
  //               ii: 9,
  //               i: 9,
  //             },
  //             {
  //               b: 'Ar2rUhi8D442diOa26+PlcroBf2Itrj35Uuc6ks82l0J',
  //               s: '\u0002��R\u0018�\u000f�6v#�ۯ����\u0005������K��K<�]\t',
  //               ii: 10,
  //               i: 10,
  //             },
  //             {
  //               b: 'bHVrZUByZWxheXguaW8=',
  //               s: 'luke@relayx.io',
  //               ii: 11,
  //               i: 11,
  //             },
  //           ],
  //           i: 0,
  //         },
  //       ],
  //       e: {
  //         v: 0,
  //         i: 1,
  //         a: 'false'
  //       },
  //     },
  //     {
  //       i: 2,
  //       tape: [
  //         {
  //           cell: [
  //             {
  //               op: 118,
  //               ops: 'OP_DUP',
  //               ii: 0,
  //               i: 0
  //             },
  //             {
  //               op: 169,
  //               ops: 'OP_HASH160',
  //               ii: 1,
  //               i: 1
  //             },
  //             {
  //               b: 'Co4Ues4qQvzfBNq+AATCxz1sEIg=',
  //               s: '\n�\u0014z�*B��\u0004ھ\u0000\u0004��=l\u0010�',
  //               ii: 2,
  //               i: 2,
  //             },
  //             {
  //               op: 136,
  //               ops: 'OP_EQUALVERIFY',
  //               ii: 3,
  //               i: 3
  //             },
  //             {
  //               op: 172,
  //               ops: 'OP_CHECKSIG',
  //               ii: 4,
  //               i: 4
  //             },
  //           ],
  //           i: 0,
  //         },
  //       ],
  //       e: {
  //         v: 11039,
  //         i: 2,
  //         a: '1xoxoxoR29oXEnxf7Wb6czNjFuXZjveTa'
  //       },
  //     },
  //     {
  //       i: 3,
  //       tape: [
  //         {
  //           cell: [
  //             {
  //               op: 118,
  //               ops: 'OP_DUP',
  //               ii: 0,
  //               i: 0
  //             },
  //             {
  //               op: 169,
  //               ops: 'OP_HASH160',
  //               ii: 1,
  //               i: 1
  //             },
  //             {
  //               b: 'R0dc+UPG7ncLxB6f6B+CFLE7deI=',
  //               s: 'GG\\�C��w\u000b�\u001e��\u001f�\u0014�;u�',
  //               ii: 2,
  //               i: 2,
  //             },
  //             {
  //               op: 136,
  //               ops: 'OP_EQUALVERIFY',
  //               ii: 3,
  //               i: 3
  //             },
  //             {
  //               op: 172,
  //               ops: 'OP_CHECKSIG',
  //               ii: 4,
  //               i: 4
  //             },
  //           ],
  //           i: 0,
  //         },
  //       ],
  //       e: {
  //         v: 170482,
  //         i: 3,
  //         a: '17VtU2C45UxEqDyoJdifrHa2mocpm7zYjH'
  //       },
  //     },
  //     {
  //       i: 4,
  //       tape: [
  //         {
  //           cell: [
  //             {
  //               op: 118,
  //               ops: 'OP_DUP',
  //               ii: 0,
  //               i: 0
  //             },
  //             {
  //               op: 169,
  //               ops: 'OP_HASH160',
  //               ii: 1,
  //               i: 1
  //             },
  //             {
  //               b: 'R0dc+UPG7ncLxB6f6B+CFLE7deI=',
  //               s: 'GG\\�C��w\u000b�\u001e��\u001f�\u0014�;u�',
  //               ii: 2,
  //               i: 2,
  //             },
  //             {
  //               op: 136,
  //               ops: 'OP_EQUALVERIFY',
  //               ii: 3,
  //               i: 3
  //             },
  //             {
  //               op: 172,
  //               ops: 'OP_CHECKSIG',
  //               ii: 4,
  //               i: 4
  //             },
  //           ],
  //           i: 0,
  //         },
  //       ],
  //       e: {
  //         v: 170482,
  //         i: 4,
  //         a: '17VtU2C45UxEqDyoJdifrHa2mocpm7zYjH'
  //       },
  //     },
  //   ],
  //   lock: 0,
  // }

  let currentExample = localStorage.getItem('example');
  if (!currentExample) {
    currentExample = Object.keys(examples)[0];
    localStorage.setItem('example', Object.keys(examples)[0]);
  }

  let txs = examples[localStorage.getItem('example')];

  // try {
  //   const xx = await bmap.TransformTx(rawBob);
  //   console.log('transform bob', xx);
  // } catch (e) {
  //   console.error('fuck', e);
  // }

  let decodePlugin = false;
  const parts = window.location.pathname.split('/')
    .slice(1);
  if (parts[0] === 'tx' && parts[1].length === 64) {
    // fetch it
    txs = [parts[1]];
    decodePlugin = true;
  }

  // The query we constructed from step 2.
  const query = {
    v: 3,
    q: {
      find: {
        'tx.h': {
          $in: txs,
        },
      },
      sort: {
        'blk.i': -1,
        i: -1,
      },
      limit: 10,
    },
  };

  // Turn the query into base64 encoded string.
  console.log('query', query);
  const b64 = btoa(JSON.stringify(query));
  // let url = 'https://bob.planaria.network/q/1GgmC7Cg782YtQ6R9QkM58voyWeQJmJJzG/' + b64
  const url = (useMom()
    ? 'https://mom.planaria.network/q/'
    : 'https://bob.planaria.network/q/1GgmC7Cg782YtQ6R9QkM58voyWeQJmJJzG/')
    + b64;

  // Attach planaria API KEY as header
  const header = {
    headers: { key: '14yHvrKQEosfAbkoXcEwY6wSvxNKteFbzU' },
  };

  list = document.createElement('div');
  list.id = 'tx-list';
  // Make an HTTP request to bmap endpoint
  fetch(url, header)
    .then((r) => {
      return r.json();
    })
    .then(async (r) => {
      console.log(r);
      const collection = !useMom() ? r.c.concat(r.u || []) : r.metanet;

      if (!collection.length) {
        document.querySelector('#currentExample').innerHTML = 'No Results';
      }

      for (tx of collection) {
        console.log('before transform:', tx);
        let bmapTx;
        try {
          bmapTx = await bmap.TransformTx(tx);
        } catch (e) {
          console.warn('error', e);
          break;
        }

        if (decodePlugin) {
          document.body.innerHTML = bmapTx;
          return;
        }
        const item = document.createElement('div');

        const txHeading = document.createElement('h5');
        txHeading.innerHTML = 'TxID: <a target="_blank" href="https://whatsonchain.com/tx/'
          + bmapTx.tx.h
          + '">'
          + bmapTx.tx.h
          + '</a>';
        item.appendChild(txHeading);

        const json = JSON.stringify(bmapTx, null, '\t');
        const edt = document.createElement('div');
        edt.innerHTML = '<textarea class="editor">' + json + '</textarea>';
        item.appendChild(edt);
        list.appendChild(item);
      }

      document.body.appendChild(list);
      let editor;
      //  editor.setTheme('ace/theme/idle_fingers')
      const editors = document.querySelectorAll('.editor');

      for (const e of editors) {
        editor = ace.edit(e);
        editor.getSession().setMode('ace/mode/json');
        editor.setTheme('ace/theme/mono_industrial');
        editor.setShowPrintMargin(false);
        editor.setOptions({
          maxLines: 25,
          minLines: 3,
          tabSize: 2,
          useSoftTabs: true,
        });
      }
    });

  // Set page title
  document.getElementById('currentExample').innerHTML = currentExample;

  for (const key in examples) {
    console.log('checking', key);
    const button = document.createElement('button');
    button.id = key;
    button.innerHTML = key;

    button.addEventListener('click', (e) => {
      localStorage.setItem('example', e.target.id);
      document.location.reload();
    });

    document.querySelector('nav')
      .appendChild(button);
  }

  momToggle.addEventListener('click', () => {
    localStorage.setItem('useMom', !useMom());
    updateMomToggle();
    document.location.reload();
  });

  updateMomToggle();
};

// Start
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    fetch('./data/example-txids.json')
      .then((response) => { return response.json(); })
      .then((json) => {
        load(json);
        return console.log(json);
      });
  });
}());
