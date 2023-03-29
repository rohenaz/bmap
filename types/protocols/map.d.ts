export type MAP = {
    app: string
    url?: string
    context: string
    subcontext?: string
    type: string
    tx?: string
    videoID?: string
    provider?: string
    tags?: string[]
    start?: string
    duration?: string
    [prop: string]: string | string[]
}
