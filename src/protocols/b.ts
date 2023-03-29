import { HandlerProps, Protocol } from '../../types/common'
import { cellValue, saveProtocolData } from '../utils'

const address = '19HxigV4QyBv3tHpQVcUEQyq1pzZVdoAut'

const opReturnSchema = [
    { content: ['string', 'binary', 'file'] },
    { 'content-type': 'string' },
    { encoding: 'string' }, // we use this field to determine content character encoding. If encoding is not a valid character encoding (gzip), we assume it is binary
    { filename: 'string' },
]

const handler = function ({ dataObj, cell, tx }: HandlerProps): void {
    const encodingMap = new Map<string, string>()
    encodingMap.set('utf8', 'string')
    encodingMap.set('text', 'string') // invalid but people use it :(
    encodingMap.set('gzip', 'binary') // invalid but people use it :(
    encodingMap.set('text/plain', 'string')
    encodingMap.set('image/png', 'binary')
    encodingMap.set('image/jpeg', 'binary')

    if (!cell[1] || !cell[2]) {
        throw new Error(`Invalid B tx: ${tx}`)
    }

    // Check pushdata length + 1 for protocol prefix
    if (cell.length > opReturnSchema.length + 1) {
        throw new Error('Invalid B tx. Too many fields.')
    }

    // Make sure there are not more fields than possible

    const bObj: { [key: string]: string | number | undefined } = {}
    // loop over the schema
    for (const [idx, schemaField] of Object.entries(opReturnSchema)) {
        const x = parseInt(idx, 10)
        const bField = Object.keys(schemaField)[0]
        let schemaEncoding = Object.values(schemaField)[0]
        if (bField === 'content') {
            // If the encoding is ommitted, try to infer from content-type instead of breaking
            if (cell[1].f) {
                // this is file reference to B files
                schemaEncoding = 'file'
            } else if ((!cell[3] || !cell[3].s) && cell[2].s) {
                schemaEncoding = encodingMap.get(cell[2].s)
                if (!schemaEncoding) {
                    console.warn(
                        'Problem inferring encoding. Malformed B data.',
                        cell
                    )
                    return
                }

                // add the missing encoding field
                if (!cell[3]) {
                    cell[3] = { h: '', b: '', s: '', i: 0, ii: 0 }
                }
                cell[3].s = schemaEncoding === 'string' ? 'utf-8' : 'binary'
            } else {
                schemaEncoding =
                    cell[3] && cell[3].s
                        ? encodingMap.get(
                              cell[3].s.replace('-', '').toLowerCase()
                          )
                        : null
            }
        }

        // encoding is not required
        if (bField === 'encoding' && !cell[x + 1]) {
            // encoding omitted
            continue
        }

        // filename is not required
        if (bField === 'filename' && !cell[x + 1]) {
            // filename omitted
            continue
        }

        // check for malformed syntax
        if (!cell || !cell[x + 1]) {
            throw new Error('malformed B syntax ' + cell)
        }

        // set field value from either s, b, ls, or lb depending on encoding and availability
        const data = cell[x + 1]
        bObj[bField] = cellValue(data, schemaEncoding)
    }

    saveProtocolData(dataObj, 'B', bObj)
}

export const B: Protocol = {
    name: 'B',
    address,
    opReturnSchema,
    handler,
}
