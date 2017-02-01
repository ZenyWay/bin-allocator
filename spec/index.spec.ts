/*
 * Copyright 2017 Stephane M. Catala
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * Limitations under the License.
 */
;
import getBinAllocator, { BinAllocator } from '../src'

describe('getBinAllocator <V>(arr: V[], opts?: Partial<BinAllocatorSpec>): ' +
'BinAllocator<V>', () => {
  describe('when called with an Array', () => {
    let arr: Array<any>
    let bins: BinAllocator<any>
    beforeEach(() => {
      arr = [ 'foo', 'bar' ]
      bins = getBinAllocator(arr).map(str => str)
    })

    it('returns an instance of BinAllocator that wraps the given array', () => {
      expect(bins).toEqual(arr)
    })
  })

  describe('when called with anything else than an Array', () => {
    let args: Array<any>
    beforeEach(() => {
      args = [ null, undefined, true, 42, 'foo', () => 'foo', { foo: 'bar' }]
    })

    it('throws an "invalid argument" TypeError', () => {
      args.forEach(arg => expect(() => getBinAllocator(arg))
      .toThrowError(TypeError, 'invalid argument'))
    })
  })

  describe('when called with an additional options argument ' +
  '{ compare <V>(a: V, b: V): number }', () => {
    let compare: <V>(a: V, b: V) => number
    beforeEach(() => {
      compare = jasmine.createSpy('compare').and.returnValue(-1)
      const bins = getBinAllocator([ 1, 2, 3 ], { compare: compare })
      ;(<jasmine.Spy>compare).calls.reset()
      bins.indexOf(5)
    })
    it('substitutes the default comparison function for the `indexOf` method ' +
    'with the one provided', () => {
      expect(compare).toHaveBeenCalledTimes(1)
    })
  })
})

describe('BinAllocator', () => {
  describe('readonly length: number', () => {
    it('returns the length of the underlying array', () => {
      expect(getBinAllocator([ 1, 2, 3 ]).length).toBe(3)
    })
  })
  describe('map <T>(cast: (value: V, index?: number, array?: V[]) => T): T[]',
  () => {
    let arr: Array<any>
    let map: (value: any, index?: number, array?: any[]) => any
    let res: Array<any>
    beforeEach(() => {
      arr = [ 1, 2, 3 ]
      spyOn(arr, 'map').and.callThrough()
      const bins = getBinAllocator(arr)
      map = (v: number, i: number) => [ i, v ]
      res = bins.map(map)
    })
    it('delegates to the map method of the underlying Array', () => {
      expect(arr.map).toHaveBeenCalledWith(map)
      expect(res).toEqual([ [0,1], [1,2], [2,3] ])
    })
  })
  describe('indexOf (value: V, fromIndex?: number): number', () => {
    describe('when called with a value', () => {
      let res: Array<any>
      beforeEach(() => {
        const bins = getBinAllocator([ 10, 20, 30 ])
        const args = [ -1, 9, 10, 11, 18, 19, 20, 21, 25, 29, 30, 31, 99 ]
        res = args.map(arg => bins.indexOf(arg))
      })
      it('returns the index of the nearest lower value in the underlying Array, ' +
      'or -1 if none lower', () => {
        expect(res).toEqual([ -1, -1, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2 ])
      })
    })
  })
})
