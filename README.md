# bin-allocator [![Join the chat at https://gitter.im/ZenyWay/bin-allocator](https://badges.gitter.im/ZenyWay/bin-allocator.svg)](https://gitter.im/ZenyWay/bin-allocator?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![NPM](https://nodei.co/npm/bin-allocator.png?compact=true)](https://nodei.co/npm/bin-allocator/)
[![build status](https://travis-ci.org/ZenyWay/bin-allocator.svg?branch=master)](https://travis-ci.org/ZenyWay/bin-allocator)
[![coverage status](https://coveralls.io/repos/github/ZenyWay/bin-allocator/badge.svg?branch=master)](https://coveralls.io/github/ZenyWay/bin-allocator)
[![Dependency Status](https://gemnasium.com/badges/github.com/ZenyWay/bin-allocator.svg)](https://gemnasium.com/github.com/ZenyWay/bin-allocator)

allocate values to bins defined by their lower bound delimitor value.

the ideal approach would have been to subclass Array and simply override the `Array#indexOf` method
such that it returns the index of the closest delimitor below the given value,
instead of returning the index of an exact match if any.
however, this is problematic, [especially in Typescript](https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work)

instead, this module favors composition over inheritance,
and currently exposes only three properties of the underlying array,
which serve the purpose of allocating values to bins:
* Array#indexOf which is overridden with the previously described behaviour,
implemented as binary search in O(n).
* Array.length (readonly)
* Array#map which effectively provides indirect access to the underlying array.

an optional comparator function can be given at instantiation.

# <a name="example"></a> example
```ts
import getBinAllocator from 'bin-allocator'
import getRandomBinsFactory from 'randombins'
import debug = require('debug')
const log = debug('example:')
debug.enable('example:')

// create bins, i.e. a list of randomly selected bin delimitor strings
const getRandomBins = getRandomBinsFactory({ size: 16, randomshuffle: <T>(arr: T[]) => arr }) // no shuffle
const alphabet = '-abcdefghijklmnopqrstuvw_'
getRandomBins([ alphabet, alphabet ])
.then(bins => {
  const orderedbins = getBinAllocator(bins)
  log('number of bins:', orderedbins.length) // 16
  log('delimitor strings:', orderedbins.map(s => s)) // e.g. ["--", "-p", "bd", ..., "ws"]

  const words = [ 'this', 'is', 'an', 'example' ]
  const indexes = words.map(word => orderedbins.indexOf(word))

  log('indexes of bins for words %o: %o', words, indexes) // e.g. indexes of ... [12, 6, 1, 4]
})
```
the files of this example are available [here](./spec/example).

a live version of this example can be viewed [here](https://cdn.rawgit.com/ZenyWay/bin-allocator/v1.0.1/spec/example/index.html)
in the browser console,
or by cloning this repository and running the following commands from a terminal:
```bash
npm install
npm run example
```

# <a name="api"></a> API v1.0 stable
`ES5` and [`Typescript`](http://www.typescriptlang.org/) compatible.
coded in `Typescript 2`, transpiled to `ES5`.

for a detailed specification of the API,
run the [unit tests](https://cdn.rawgit.com/ZenyWay/bin-allocator/v1.0.1/spec/web/index.html)
in your browser.

# <a name="contributing"></a> CONTRIBUTING
see the [contribution guidelines](./CONTRIBUTING.md)

# <a name="license"></a> LICENSE
Copyright 2017 Stéphane M. Catala

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the [License](./LICENSE) for the specific language governing permissions and
Limitations under the License.
