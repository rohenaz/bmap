(async function () {
  const examples = {
    B_MAP_AIP_1: [
      'cdfe7ae5c91afe4dc3a5db383e0ca948ec3d51dc2954a9d18ca464db7c9d5d3d',
    ],
    B_MAP_AIP_2: [
      '1a7cdf318416d81a3546b7b27b5c569d5099300f3cca385d1531c270524aa653',
    ],
    B_MAP_AIP_MANY: [
      '0272e1b230dfe2603a77469037ad04b32661261ec1453261ded793da0ce297f6',
      '46991bd7b30c136e41626e998fc04fab8830bb0a8fab8ae8410081426c3d6505',
      '6645b54733bf630597a89540bc336804d297161113a3290e4285c1bb5e54119b',
      '536dc444770e0841fbf1b7813e6b228d962a240677be8b778100fc01dfb7ae7d',
      '36b01a3216e3728b929356a5c4ed137ad4093e14b8d0d92d3d4080721c1c2321',
      '7b9145df4b41dad05569248c1ac0d3cb5483d898eab30abcd30348c131df14a6',
      '0afee9bf5603fa529a9d2bda06123c5306079fdb7e64d4db3a32fa46d78b510a',
      '1a7cdf318416d81a3546b7b27b5c569d5099300f3cca385d1531c270524aa653',
      '000e988b20060a237c024d24cace5974050f446f8d5c355fe2f031256631b814',
    ],
    BAEMAIL: [
      '9a5c1f7df46946078f24c58578f890803efbe52f667ce70d5828559fb173127f',
      '78a626bfa4cd338731886d2e04e6b8caa0c4e0dd7cfa5d65d7a61f66cc003801',
      '8333f79aec14b517c8522464bdb99298cf214d2b41d4e111fccd65ddee6ef810',
      '87e44ea3a36ba7d7e5f8ffd234685a956df40c9de9f5c29983d62187c327f0bf',
      '9c1a93b3155a316eb76f71a4923ad7b373423aae40d5e5a327ca332fa2fc70db',
    ],
    BAP: [
      'b0b5f1f42c9fdf12bb25b27f871ece1da7a2772dd9554a8e858e6e26b4ca0ef9',
      'cbe846bf4edb9140b1868942dea112c03d0a2a565da02c3512a17663f9a0d3bf',
    ],
    BITCOM_ECHO: [
      'c5b43dce7d9805fb2797650f5b9af18d5d80e913ece16ee1adae48b1005398ad',
    ], // echo
    BITKEY: [
      'd3ca9a8654c70ba2472908d031380c3db769a8b02d4aa62fb8878b204644755b',
    ],
    BITKEY_2: [
      '1f9e31750a2f0280a08c3781f41904a098e82fb3aa8a7d39f138fb9927289651',
    ], // SU
    bitpaste: [
      '33d963997360d9edb6b056b9c46cbece48637ed6daa6f2ddd2ea4073ce2e8c72',
    ],
    BITPIC: [
      'c0e1bc05f7da82ec114d443d873e8561ea225d3f021730c9e5aa66822073f965',
    ],
    D: ['19iG3WTYSsbyos3uJ733yK4zEioi1FesNU'],
    MAP: [
      '34ba78755c4db1179029537a2b0189aac75a8ac0c6c99f30fec06c60aa71b183',
    ], // hagbard
    META_1: [
      '07790cb21e48fc98296319efed3645c3b43307031ce6748fa1aed929b24f0f89',
    ],
    META_2: [
      '0e34cc59e1c80262b1f25a8079dddcd3a47b90d728b5a3a7348b70a7c437b80c',
    ],
    META_3: [
      '70bcbe4dc1ff796389e3de4f5f151cff7eb4a172142468a79677c703afd930b9',
      '59f2e83ac0607d44d764b9040aaa8dd8741e6169444739464f97422055ad001c',
      '06ea0de45680b790d25372bc12b52c7e740e3b10f36d8aabd8b8a31e858a79c2',
    ],
    metanaria: [
      '4410068e7582c79da06adc5d6ff32d2845b6e9c002f566f1ebf8b09bbb4d68ca',
      '3252152dd6b1d3a02030a968664e9c465a7934ef72d54923b55ef6e460196e43',
      '08078b86273342b2ced4983dc1a8992ddeac165d9b69d72b002a3374bf004c11',
      'b1c0d7393e4184f7a0b1036d2d83ad5345e7b406fe42174c8ff4021c1004e0b0',
      '66094e053724980819aa2e1010549a7161c33394c8f86b5e03b979c5b3856297',
    ],
    open_directory: [
      '095d09380b391f12521f926810f09072b2ae47c8b1ac2633a6082bf237704d4b',
      '38140a21180c638e56c271920a7d0f6e86bf31ca3ec0ead49365828389e32875',
    ],
    RON: [
      'e63079a1c3ead70c846fefae47483ea2d7724054460b87c9d70c1a255d9d6026',
    ],
    'SV.CHAT': [
      '474fd7df692ccc1e0ad33a0ad525d427fb850f8614eeda1fa29ee2e67ed1a4af',
      'f88727a2db0a6bf3ce5eb4f4fd8a00d8f26a7fdc99e8a6ccba8df1a5a1312ed9',
      'b168c31d3d8b77323a18ef97d718ac88326a3346a05c322281c6980d61b41515',
      '5badab2757f22c4cf1e9c07bd7e8c24557a7d3a42b1eec960401f724064272ad',
    ],
    symre_HAIP: [
      '3682dd4c0fc3346b21882e4669b6585733705bacdfb48d2166dff92338093468',
    ],
    symre_old: [
      'de6e22a88a7739325793941c53eab6c39b8f817e15f4e305ea6a084040f271f9',
    ],
    TWETCH: [
      '001c045061ff62bbaec38edc3f925efb2f005c524938b85c07bbc7b82cccc0e0',
      'fdfc5ab2efbd83a617f79eaf82348e9879499406c3cc9f7fcb902164cbb25956',
      'f55c43e434055d544ccb3169f56723d49a4e6039d5837d54a243c738bf603c38',
    ],
    MAP_JSON: [
      '6a824a01eea74d8bab0da204c61c758cfde0d0f92845a1b2b616b8d3ae4cec99',
    ],
    MAP_MSGPACK: [
      '39791e114c5619bfccef5ab6c0e4cdae4e6340e41f67616b11bcb926ae5f9d33',
    ],
    TONICPOW_EMBED: [
      '60afdabd8c91ba2499e8abff2f0638a7ce5b4a2e585fd33914acb956ce3f8b18',
    ],
    PSP_2PAYMAIL: [
      'ce7429a101b7aecdf1e5449151d0be17a3948cb5c22282832ae942107edb2272',
    ],
    MINERVA: [
      '08b7399718f71e620e6c24a7fb5165ae17e6c422da122edf16d908c26fbfb62f',
    ],
    MINERVA2: [
      '4a0b56c70944c4b5886e424a66b0080e59fb59b430c5969e16040cb496864b04',
    ],
  };

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

  try {
    const xx = await bmap.TransformTx(rawBob);
    console.log('transform bob', xx);
  } catch (e) {
    console.error('fuck', e);
  }

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

  // Fields to display as text
  const textFields = [];

  // Fields to omit
  const ignoredFields = ['tx', 'blk', 'in', '_id', 'i', 'mem'];

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

  document.addEventListener('DOMContentLoaded', () => {
    // Set page title
    document.getElementById('currentExample').innerHTML = currentExample;

    for (const key in examples) {
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

    const momToggle = document.querySelector('#momToggle');
    momToggle.addEventListener('click', () => {
      localStorage.setItem('useMom', !useMom());
      updateMomToggle();
      document.location.reload();
    });

    updateMomToggle();
  });

  function updateMomToggle() {
    momToggle.innerHTML = 'Switch to ' + (!useMom() ? 'MOM' : 'BOB');
  }

  function useMom() {
    return localStorage.getItem('useMom') === 'true';
  }
}());
