import { PaymailClient } from '@moneybutton/paymail-client';
import fetch from 'node-fetch';
import dns from 'dns';

export const verifyPaymailPublicKey = async function (paymail, publicKey) {
  const client = new PaymailClient(dns, fetch);
  return client.verifyPubkeyOwner(publicKey, paymail);
};
