import * as fs from 'fs'

import {SchemaItem} from '../..'

import getArgs from './json'

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
        const spy = jest.spyOn(fs, 'readFileSync').mockReturnValue(
            Buffer.from(
                JSON.stringify({
                    test1: {
                        test1a: 'testing'
                    }
                })
            )
        )
        const config = getArgs({schema, sync: true, filePath: '/test/config.json'})
        expect(config).toEqual({
            'test1.test1a': 'testing'
        })
        spy.mockRestore()
    })

    it('should catch errors in JSON and throw', () => {
        const spy = jest
            .spyOn(fs, 'readFileSync')
            .mockReturnValue(Buffer.from('{some invalid json'))
        expect(() => getArgs({schema, sync: true, filePath: '/test/config.json'})).toThrow(
            "Failed to read file '/test/config.json' got 'Unexpected token s in JSON at position 1'"
        )
        spy.mockRestore()
    })

    it('should catch errors in readFileSync and throw', () => {
        const spy = jest.spyOn(fs, 'readFileSync').mockImplementation((..._args: any[]) => {
            throw new Error('File not found')
        })
        expect(() => getArgs({schema, sync: true, filePath: '/test/config.json'})).toThrow(
            "Failed to read file '/test/config.json' got 'File not found'"
        )
        spy.mockRestore()
    })

    it('should work asyncronously', async () => {
        const readFile = (_path: string, _option: string, cb: any) =>
            cb(
                null,
                Buffer.from(
                    JSON.stringify({
                        test1: {
                            test1b: 666
                        }
                    })
                )
            )
        // @ts-ignore
        const spy = jest.spyOn(fs, 'readFile').mockImplementation(readFile)
        const config = await getArgs({schema, sync: false, filePath: '/test/config.json'})
        expect(config).toEqual({
            'test1.test1b': 666
        })
    })

    it('should catch errors asyncronously', async () => {
        const readFile = (_path: string, _option: string, cb: any) =>
            cb(new Error('File not found'))
        // @ts-ignore
        const spy = jest.spyOn(fs, 'readFile').mockImplementation(readFile)

        const promise = getArgs({schema, sync: false, filePath: '/test/config.json'})
        expect(promise).rejects.toEqual(
            new Error("Failed to read file '/test/config.json' got 'File not found'")
        )
    })
})
