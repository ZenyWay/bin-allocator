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
import getBinAllocator from '../../src'
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
