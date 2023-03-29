export type HAIP = {
    signing_address: string
    hashing_algorithm?: string
    signing_algorithm?: string
    index: number[]
    index_unit_size: number
    signature: string
    verified: boolean
}
