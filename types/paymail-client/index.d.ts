declare module '@moneybutton/paymail-client' {
    export class BrowserDns {
        constructor(fetch)
    }

    export class DnsOverHttps {
        constructor(fetch, config)
        static fetch
        static config

        resolveSrv(aDomain): Promise<Object>
        queryBsvaliasDomain(aDomain): Promise<Object>
    }

    export class PaymailClient {
        constructor(dns?: module, fetch2?: module)
        verifyPubkeyOwner(publicKey: string, paymail: string)
    }
}
