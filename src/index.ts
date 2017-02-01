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
export interface BinAllocatorFactory {
  <V>(arr: V[], opts?: Partial<BinAllocatorSpec>): BinAllocator<V>
}

export interface BinAllocatorSpec {
  compare <V>(a: V, b: V): number
}

export interface BinAllocator<V> {
  indexOf (value: V, fromIndex?: number): number
  map <T>(cast: (value: V, index?: number, array?: V[]) => T): T[]
  readonly length: number
}

class BinAllocatorClass<V> implements BinAllocator<V> {
  static getInstance: BinAllocatorFactory =
  function <V>(bins: V[], opts?: Partial<BinAllocatorSpec>): BinAllocator<V> {
    if (!Array.isArray(bins)) { throw new TypeError('invalid argument') }
    const compare =
    opts && isFunction(opts.compare) ? opts.compare : defaultCompare

    return new BinAllocatorClass<V>(compare, bins.sort(compare))
  }

  indexOf (value: V, fromIndex?: number): number {
    const last =  this.delimitors.length - 1
    const int = Math.floor(fromIndex) || 0
    const start = int < 0 ? min(this.delimitors.length + int, 0) : int

    return (start > last) || (this.compare(value, this.delimitors[0]) < 0)
    ? -1
    : findIndex(this.delimitors, this.compare, value, start, last)
  }

  map <T>(cast: (value: V, index?: number, array?: V[]) => T): T[] {
    return this.delimitors.map(cast)
  }

  get length () {
    return this.delimitors.length
  }

  private constructor (
    private compare: (a: V, b: V) => number,
    /**
    * typescript 2.1 breaking change:
    * Extending built-ins like Error, Array, and Map may no longer work
    * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    * -> composition instead of inheritance
    */
    private delimitors: V[]
  ) {}
}

function defaultCompare <V>(a: V, b: V): number {
  return a === b ? 0 : a < b ? -1 : 1
}

function min (a: number, b: number): number {
  return a < b ? a : b
}

/**
 * binary search.
 * assumes the searched array is ordered with the given `compare` function.
 * O(log(n)) instead of O(n) for Array#indexOf.
 */
function findIndex <V>(arr: V[], compare: (a: V, b: V) => number, val: V,
first: number, last: number): number {
  const length = last - first + 1
  if (length === 1) { return last }
  const index = first + (length >>> 1)
  const min = arr[index]
  const pos = compare(val, min)
  return !pos
  ? index
  : pos < 0
    ? findIndex(arr, compare, val, first, index - 1)
    : findIndex(arr, compare, val, index, last)
}

function isFunction (val: any): val is Function {
  return typeof val === 'function'
}

const getBinArray: BinAllocatorFactory = BinAllocatorClass.getInstance
export default getBinArray
