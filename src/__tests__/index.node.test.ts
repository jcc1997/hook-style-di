import { createScope, use, useShared } from 'hook-di'
import { describe, expect, it } from 'vitest'
import { AKey, useA } from './hooks'

describe('basic usage in node', () => {
  it('register and use in single scope', () => {
    const scope = createScope()

    scope.register(AKey, useA)

    scope.run(() => {
      const a = use(AKey)

      console.log(a.name())

      a.log('register and use in single scope')

      const newA = use(AKey)
      expect(a, 'a equal to newA').not.toEqual(newA)
    })
  })

  it('register and useShared in single scope', () => {
    const scope = createScope()

    scope.register(AKey, useA)

    scope.run(() => {
      const a = useShared(AKey)

      console.log(a.name())

      a.log('register and use in single scope')

      const aCopy = useShared(AKey)

      expect(a, 'a equal to aCopy').toEqual(aCopy)
    })
  })
})

describe('chain test', () => {
  it('register and use in scopes tree', () => {
    const scope = createScope()

    scope.register(AKey, useA)

    scope.run(() => {
      const a = useShared(AKey)

      console.log(a.name())
      a.log('register and use in single scope')

      const scopeChild = createScope()
      scopeChild.run(() => {
        const childA = useShared(AKey)

        expect(a).toEqual(childA)
      })
    })
  })
})

describe('async test', () => {
  it('use async method', async () => {
    const scope = createScope()

    scope.register(AKey, useA)

    await scope.run(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))

      const a = useShared(AKey)

      expect(a.name()).toBe('useA')
      a.log('register and use in single scope')
    })
  })
})