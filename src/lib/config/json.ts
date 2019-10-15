import * as flatten from 'flat'
import * as fs from 'fs'

import {OptionsConfigItemOptions} from './../../index'

export default function getConfigJson(
    options: OptionsConfigItemOptions
): Promise<{[key: string]: any}> | {[key: string]: any} {
    const parseAndReturn = (jsonContent: string) => {
        let result: {[key: string]: any}
        try {
            result = flatten<any, any>(JSON.parse(jsonContent))
        } catch (error) {
            throw new Error(`Failed to read file '${options.filePath}' got '${error.message}'`)
        }
        return result
    }

    if (options.sync) {
        try {
            const content = fs.readFileSync(options.filePath, 'utf8')
            return parseAndReturn(content)
        } catch (error) {
            throw new Error(`Failed to read file '${options.filePath}' got '${error.message}'`)
        }
    }

    const readFile = new Promise<string>((resolve, reject) => {
        fs.readFile(options.filePath, 'utf8', (error, content) => {
            if (error) {
                return reject(
                    new Error(`Failed to read file '${options.filePath}' got '${error.message}'`)
                )
            }
            return resolve(content)
        })
    })

    return readFile.then(parseAndReturn)
}
