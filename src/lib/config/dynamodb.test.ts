import * as AWS from 'aws-sdk'

import {SchemaItem} from '../..'

import getArgs from './dynamodb'

const schema: SchemaItem[] = [
    {key: 'test1.test1a', type: 'string'},
    {key: 'test1.test1b', type: 'number'},
    {key: 'test1.test1c', type: 'string', nullable: true},
    {key: 'test2', type: 'string', allowed: ['1', '2', '3']},
    {key: 'test3', type: 'number', default: 1, allowed: [1, 2, 3]},
    {key: 'test4', type: 'boolean', default: false}
]

describe('Default module', () => {
    it('should NOT work syncronously', () => {
        expect(() =>
            getArgs({schema, sync: true, tableName: 'Config', region: 'eu-west-1'})
        ).toThrow('This type does not support sync')
    })

    it('should handle errors from dynamodb', async () => {
        // @ts-ignore
        AWS.DynamoDB.DocumentClient = class Mock {
            scan(_scanParams: any, cb: any) {
                cb(new Error('Some AWS error'))
            }
        }
        const config = getArgs({
            schema,
            sync: false,
            tableName: 'Config',
            region: 'eu-west-1'
        })
        expect(config).rejects.toEqual(new Error('Some AWS error'))
    })

    it('should get config from dynamodb', async () => {
        // @ts-ignore
        AWS.DynamoDB.DocumentClient = class Mock {
            scan(_scanParams: any, cb: any) {
                cb(null, {
                    Items: [{key: 'test1.test1c', value: 'test'}]
                })
            }
        }
        const config = await getArgs({
            schema,
            sync: false,
            tableName: 'Config',
            region: 'eu-west-1'
        })
        expect(config).toEqual({
            'test1.test1c': 'test'
        })
    })

    it('should handle no response from dynamodb', async () => {
        // @ts-ignore
        AWS.DynamoDB.DocumentClient = class Mock {
            scan(_scanParams: any, cb: any) {
                cb(null, {})
            }
        }
        const config = await getArgs({
            schema,
            sync: false,
            tableName: 'Config',
            region: 'eu-west-1'
        })
        expect(config).toEqual({})
    })
})
