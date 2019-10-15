import * as helpers from 'lib/helpers'

describe('Helpers', () => {
    it('should show real type of var', () => {
        expect(helpers.realTypeOf(undefined)).toEqual('undefined')
        expect(helpers.realTypeOf('undefined')).toEqual('string')
        expect(helpers.realTypeOf(1234)).toEqual('number')
        expect(helpers.realTypeOf({})).toEqual('object')
        expect(helpers.realTypeOf([])).toEqual('array')
        expect(helpers.realTypeOf(/test/)).toEqual('regexp')
        expect(helpers.realTypeOf(new Date())).toEqual('date')
        expect(helpers.realTypeOf(null)).toEqual('null')
    })

    it('should parse boolean (boolean -> boolean)', () => {
        expect(helpers.toBoolean(false)).toEqual(false)
        expect(helpers.toBoolean(true)).toEqual(true)
    })
    it('should parse boolean (string -> false)', () => {
        expect(helpers.toBoolean('0')).toEqual(false)
        expect(helpers.toBoolean('false')).toEqual(false)
        expect(helpers.toBoolean('FALSE')).toEqual(false)
        expect(helpers.toBoolean('False')).toEqual(false)
    })
    it('should parse boolean (string -> true)', () => {
        expect(helpers.toBoolean('1')).toEqual(true)
        expect(helpers.toBoolean('true')).toEqual(true)
        expect(helpers.toBoolean('TRUE')).toEqual(true)
        expect(helpers.toBoolean('True')).toEqual(true)
    })
    it('should parse boolean (number -> false)', () => {
        expect(helpers.toBoolean(0)).toEqual(false)
    })
    it('should parse boolean (number -> true)', () => {
        expect(helpers.toBoolean(1)).toEqual(true)
    })
    it('should parse invalid values to false', () => {
        expect(helpers.toBoolean(-1)).toEqual(false)
        expect(helpers.toBoolean(2)).toEqual(false)
        expect(helpers.toBoolean('X')).toEqual(false)
        expect(helpers.toBoolean(undefined)).toEqual(false)
        expect(helpers.toBoolean(new Date())).toEqual(false)
    })

    it('should parse number', () => {
        expect(helpers.parseValue({type: 'number'}, '12345')).toEqual(12345)
    })
    it('should parse boolean', () => {
        expect(helpers.parseValue({type: 'boolean'}, 1)).toEqual(true)
        expect(helpers.parseValue({type: 'boolean'}, 0)).toEqual(false)
    })
    it('should handle null', () => {
        expect(helpers.parseValue({type: 'string'}, 'null')).toEqual(null)
    })
})
