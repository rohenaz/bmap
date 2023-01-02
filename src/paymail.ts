import { PaymailClient } from '@moneybutton/paymail-client'
import dns from 'dns'
import fetch from 'node-fetch'

export const verifyPaymailPublicKey = async function (
    paymail: string,
    publicKey: string
): Promise<boolean> {
    if (window) {
        // Paymail client will use BrowserDns if dns is null here
        const client = new PaymailClient(null, fetch)
        return client.verifyPubkeyOwner(publicKey, paymail)
    } else {
        const client = new PaymailClient(dns, fetch)
        return client.verifyPubkeyOwner(publicKey, paymail)
    }
}
