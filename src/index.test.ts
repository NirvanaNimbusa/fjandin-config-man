import * as fs from 'fs'

import * as configMan from './index'

describe('Config Man', () => {
    beforeEach(() => {
        configMan.reset()
    })

    it('should fail when no json is defined', async () => {
        const promise = configMan.init({})
        expect(promise).rejects.toEqual(
            new Error('ConfigMan: You need to add a config-man.json file to your project root.')
        )
    })

    it('should initialize', async () => {
        const spy1 = jest.spyOn(fs, 'existsSync').mockReturnValue(true)
        const spy2 = jest.spyOn(fs, 'readFileSync').mockReturnValue(
            JSON.stringify({
                schema: [
                    {key: 'test1.test1a', type: 'string'},
                    {key: 'test1.test1b', type: 'number'},
                    {key: 'test1.test1c', type: 'string', nullable: true},
                    {key: 'test2', type: 'string', allowed: ['1', '2', '3']},
                    {key: 'test3', type: 'number', default: 1, allowed: [1, 2, 3]},
                    {key: 'test4', type: 'boolean', default: false}
                ]
            })
        )
        const init: any = configMan.init({
            cwd: '/test/',
            allowUnknown: true,
            removeUnknown: true,
            configs: [
                {type: configMan.ConfigType.DEFAULT},
                {
                    type: configMan.ConfigType.JSON,
                    filePath: '/test/config.json'
                }
            ]
        })

        expect(configMan.STATE.initialized).toEqual(false)
        await init
        expect(configMan.STATE.initialized).toEqual(true)
        expect(configMan.STATE.config).toEqual({
            test1: {
                test1a: 'test',
                test1b: 12345,
                test1c: null
            },
            test2: '2',
            test3: 3,
            test4: false
        })

        spy1.mockRestore()
        spy2.mockRestore()
    })
})
