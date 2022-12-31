const load = async (ex) => {
  const examples = ex;

  let currentExample = localStorage.getItem('example');
  if (!currentExample) {
    currentExample = Object.keys(examples)[0];
    localStorage.setItem('example', Object.keys(examples)[0]);
  }

  let txs = examples[localStorage.getItem('example')];

  let decodePlugin = false;
  const parts = window.location.pathname.split('/')
    .slice(1);
  if (parts[0] === 'tx' && parts[1].length === 64) {
    // fetch it
    txs = [parts[1]];
    decodePlugin = true;
  }

  const url = `https://bmapjs.com/tx/${txs[0]}/bob`
  
  list = document.createElement('div');
  list.id = 'tx-list';
  
  // Make an HTTP request to bmap endpoint
  fetch(url)
    .then((r) => {
      return r.json();
    })
    .then(async (r) => {
      console.log(r);
      let tx = r

      // TODO: There are some examples with multiple transactions
      // removed support for this when migrating to v0.4.0 and removing bob in favor of bmapjs.com to fetch transactions one at a time
      // add support for the other transactions by putting this into a loop instead of just using txs[0]

      
      // for (tx of collection) {
        console.log('before transform:', tx);
        let bmapTx;
        try {
          bmapTx = await bmap.TransformTx(tx, bmap.supportedProtocols)
          // const bm = new bmap.BMAP()
          // // Add non default handlers
          
          // bm.addProtocolHandler(bmap.protocolMap.get('BOOST'))
          // bmapTx = await bm.transformTx(tx);
        } catch (e) {
          console.warn('error', e);
          // break;
          return
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
      //}

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
