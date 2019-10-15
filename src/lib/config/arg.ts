import {OptionsConfigItemOptions} from './../../index'
import {parseValue} from './../helpers'

export const getArgv = () => process.argv

export default function getConfigArg(
    options: OptionsConfigItemOptions
): Promise<{[key: string]: any}> | {[key: string]: any} {
    const argv = getArgv()
    const prefix = options.prefix || 'cm'
    const schema = options.schema
    const args: {[key: string]: any} = argv.reduce((a: {[key: string]: any}, b, i) => {
        if (b === `--${prefix}`) {
            const [key, value] = (argv[i + 1] || '').split('=')
            if (key && value) {
                return {...a, [key]: value}
            }
        }
        return a
    }, {})

    const result = schema.reduce((a: {[key: string]: any}, schemaItem) => {
        if (args[schemaItem.key]) {
            return {
                ...a,
                [schemaItem.key]: parseValue(schemaItem, args[schemaItem.key])
            }
        }
        return a
    }, args)

    return options.sync ? result : Promise.resolve(result)
}
