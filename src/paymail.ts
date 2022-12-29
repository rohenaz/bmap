import { PaymailClient } from '@moneybutton/paymail-client'
import dns from 'dns'
import fetch from 'node-fetch'

export const verifyPaymailPublicKey = async function (
    paymail: string,
    publicKey: string
) {
    const client = new PaymailClient(dns, fetch)
    return client.verifyPubkeyOwner(publicKey, paymail)
}
