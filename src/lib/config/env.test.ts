import {SchemaItem} from '../..'

import getArgs from './env'

const schema: SchemaItem[] = [
    {key: 'test1.test1a', type: 'string'},
    {key: 'test1.test1b', type: 'number'},
    {key: 'test1.test1c', type: 'string', nullable: true},
    {key: 'test2', type: 'string', allowed: ['1', '2', '3']},
    {key: 'test3', type: 'number', default: 1, allowed: [1, 2, 3]},
    {key: 'test4', type: 'boolean', default: false}
]

describe('Environment module', () => {
    it('should work syncronously', () => {
        process.env.CM_test2 = '1'
        const config = getArgs({schema, sync: true})
        expect(config).toEqual({
            test2: '1'
        })
        process.env.CM_test2 = ''
    })

    it('should work asyncronously', async () => {
        process.env.CM_test1_test1a = 'testing'
        const config = getArgs({schema, sync: false})
        await expect(config).resolves.toEqual({
            'test1.test1a': 'testing'
        })
        process.env.CM_test1_test1a = ''
    })

    it('should work with custom prefix and seperator', async () => {
        process.env['XX-test1-test1a'] = 'testing'
        const config = getArgs({schema, sync: false, prefix: 'XX', seperator: '-'})
        await expect(config).resolves.toEqual({
            'test1.test1a': 'testing'
        })
        process.env.CM_test1_test1a = ''
    })
})
