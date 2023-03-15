/// <reference path="../types/paymail-client/index.d.ts"/>
import { PaymailClient } from '@moneybutton/paymail-client'
/// <reference path="../types/paymail-client/index.d.ts"/>
export { PaymailClient } from '@moneybutton/paymail-client'

import dns from 'dns'
import fetch from 'node-fetch'

export const verifyPaymailPublicKey = async function (
    paymail: string,
    publicKey: string
): Promise<boolean> {
    if (typeof window !== 'undefined') {
        // Paymail client will use BrowserDns if dns is null here
        // and isomorphic-fetch if fetch is null
        const client = new PaymailClient()
        return client.verifyPubkeyOwner(publicKey, paymail)
    } else {
        const client = new PaymailClient(dns, fetch)
        return client.verifyPubkeyOwner(publicKey, paymail)
    }
}
