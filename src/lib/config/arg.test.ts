import {SchemaItem} from '../..'

import getArgs, * as helpers from './arg'

const schema: SchemaItem[] = [
    {key: 'test1.test1a', type: 'string'},
    {key: 'test1.test1b', type: 'number'},
    {key: 'test1.test1c', type: 'string', nullable: true},
    {key: 'test2', type: 'string', allowed: ['1', '2', '3']},
    {key: 'test3', type: 'number', default: 1, allowed: [1, 2, 3]},
    {key: 'test4', type: 'boolean', default: false}
]

describe('Argument module', () => {
    let spy: jest.SpyInstance

    beforeEach(() => {
        spy = jest.spyOn(helpers, 'getArgv')
    })

    afterEach(() => {
        spy.mockRestore()
    })

    it('should work syncronously', () => {
        spy.mockRestore()
        const config = getArgs({schema, sync: true})
        expect(config).toEqual({})
    })

    it('should get config from argument', async () => {
        spy.mockReturnValue(['--cm', 'test1.test1a=testing', '--cm', 'unknown=test'])
        const config = await getArgs({schema, sync: false})
        expect(config).toEqual({
            'test1.test1a': 'testing',
            unknown: 'test'
        })
    })

    it('should get config from argument (prefix override)', async () => {
        spy.mockReturnValue(['--xx', 'test1.test1a=testing', '--cm', 'test=test', '--xx'])
        const config = await getArgs({schema, sync: false, prefix: 'xx'})
        expect(config).toEqual({
            'test1.test1a': 'testing'
        })
    })
})
