declare module '@moneybutton/paymail-client' {
    export class PaymailClient {
        constructor(dns: module, fetch: module)
        verifyPubkeyOwner(publicKey: string, paymail: string)
    }
}
