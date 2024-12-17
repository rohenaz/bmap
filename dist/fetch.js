let examples
let currentTxid = localStorage.getItem('example');
let currentProtocol = localStorage.getItem('protocol') || 'B';

const getExample = (txid, protocol) => {
      if(txid) {
        return examples.filter((e) => e.protocols.includes(protocol) && e.txid === txid)[0]
      } else {
        return examples.filter((e) => e.protocols.includes(protocol))[0]
      }
}

const load = async (ex) => {
    examples = ex;


  for (const protocol of bmap.supportedProtocols.sort((a, b) => a < b ? -1 : 1)) {
    const button = document.createElement('button');



    button.id = protocol;

    // examples.some((e) => e.protocols.includes(protocol) && e.protocols.includes(currentProtocol))
    let example = getExample(currentTxid, currentProtocol)
    button.classList.add('protocol-button');

    if (currentProtocol === protocol) {
      button.classList.add('selected');
    } else if (example?.protocols.includes(protocol)) {

    // if current example supports this protocol
      button.classList.add('subselected');
    }
    button.innerHTML = `${protocol}`;

    button.addEventListener('click', (e) => {
      localStorage.setItem('protocol', e.target.id);
      const example = getExample(undefined, e.target.id);
      console.log('example', example)
      localStorage.setItem('example', example.txid);
      document.location.reload();
    });

    document.querySelector('nav')
      .appendChild(button);
  }



  const matchingExamples = examples.filter((e) => e.protocols.includes(currentProtocol))

  let i = 1
  for (const e of matchingExamples) {
    const button = document.createElement('button');

    button.id = e.txid;
    button.innerHTML = `Example ${i++}`;

    if (currentTxid === e.txid) {
      button.classList.add('selected')
    }

    button.addEventListener('click', (e) => {
      localStorage.setItem('example', e.target.id);
      document.location.reload();
    });


    document.getElementById('subnav')
    .appendChild(button);
  }

  // let txs = examples.filter((e) => e.protocols.includes(currentProtocol)).map((e) => e.txid);

  const url = `https://bmapjs.com/tx/${currentTxid}/bob`
  
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

        } catch (e) {
          console.warn('error', e);
          // break;
          return
        }


        if (currentProtocol === 'MAP') {
          console.log("do i have the example?", bmapTx)
          const mapCoreKeys = bmapTx.MAP?.map((m) => { return {cmd: m.cmd, app: m.app, type: m.type}} )
      
          for (let k of mapCoreKeys) {
      
            const mapKeysEle = document.createElement('div')
            mapKeysEle.classList.add('map-keys')
            mapKeysEle.innerHTML = `<span>Cmd: ${k.cmd || 'NOT SET!'} App: ${k.app || 'NOT SET!'} Type: ${k.type}</span>`
      
            exampleEle.parentNode.insertBefore(mapKeysEle, exampleEle.nextSibling);
          }
        }

        const item = document.createElement('div');
        item.style.padding = '1rem';
        // Show txid link
        const txHeading = document.createElement('small');
        txHeading.style.fontSize = '.8rem'
        txHeading.innerHTML = 'Treansaction ID:<br /><br /><a target="_blank" href="https://whatsonchain.com/tx/'
          + bmapTx.tx.h
          + '">'
          + bmapTx.tx.h
          + '</a>';
        item.appendChild(txHeading);

        // list protocols
        const txSubHeading = document.createElement('h5');

        let currentExample
        if (currentProtocol && !currentTxid) {
          currentExample = getExample(undefined, currentProtocol)
          localStorage.setItem('example', currentExample.txid);
        } else {
          currentExample = getExample(currentTxid, currentProtocol)
        }

        console.log({currentExample})
        txSubHeading.innerHTML = `Protocols Detected: ${currentExample?.protocols.join(', ').replace(/, $/, '')}`;
        item.appendChild(txSubHeading);

        const json = JSON.stringify(bmapTx, null, '\t');
        const edt = document.createElement('div');
        edt.innerHTML = '<textarea class="editor">' + json + '</textarea>';
        item.appendChild(edt);
        list.appendChild(item);
      //}

      document.getElementById("example-container").appendChild(list);
      let editor;
      //  editor.setTheme('ace/theme/idle_fingers')
      const editors = document.querySelectorAll('.editor');

      for (const e of editors) {
        editor = ace.edit(e);
        editor.getSession().setMode('ace/mode/json');
        editor.setTheme('ace/theme/kr_theme');
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
  const exampleEle = document.getElementById('currentExample')
  exampleEle.innerHTML = currentProtocol;
  


};

// Start
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    fetch('./data/example-txids.json')
      .then((response) => { return response.json(); })
      .then((json) => {


        document.getElementById('supported_protocols').innerHTML = bmap.supportedProtocols.join(', ').replace(/, $/, '\n')

        load(json);
        return console.log(json);
      });
  });
}());
