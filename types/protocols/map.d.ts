export type MAP = {
    app: string
    type: string
    context?: string
    subcontext?: string
    collection?: string
    url?: string
    audio?: string
    channel?: string
    rarity?: string
    tx?: string
    videoID?: string
    provider?: string
    tags?: string[]
    start?: string
    duration?: string
    [prop: string]: string | string[]
}
