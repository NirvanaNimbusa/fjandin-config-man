import {SchemaItem} from '../..'

import getArgs from './default'

const schema: SchemaItem[] = [
    {key: 'test1.test1a', type: 'string'},
    {key: 'test1.test1b', type: 'number'},
    {key: 'test1.test1c', type: 'string', nullable: true},
    {key: 'test2', type: 'string', allowed: ['1', '2', '3']},
    {key: 'test3', type: 'number', default: 1, allowed: [1, 2, 3]},
    {key: 'test4', type: 'boolean', default: false}
]

describe('Default module', () => {
    it('should work syncronously', () => {
        const config = getArgs({schema, sync: true})
        expect(config).toEqual({
            test3: 1,
            test4: false
        })
    })

    it('should work asyncronously', async () => {
        const config = getArgs({schema, sync: false})
        return expect(config).resolves.toEqual({
            test3: 1,
            test4: false
        })
    })
})
