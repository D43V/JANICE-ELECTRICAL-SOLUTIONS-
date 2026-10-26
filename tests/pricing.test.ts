import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateQuote } from '../lib/pricing'
test('calculates minor-unit totals without floating point drift',()=>{assert.deepEqual(calculateQuote([{quantity:3,unitPriceMinor:1250,addonMinor:99}],500,100,190),{subtotal:3849,additionalMinor:500,discountMinor:100,taxMinor:190,total:4439})})
test('rejects manipulated quantities',()=>{assert.throws(()=>calculateQuote([{quantity:0,unitPriceMinor:100}]),/Invalid quantity/)})
test('rejects negative prices',()=>{assert.throws(()=>calculateQuote([{quantity:1,unitPriceMinor:-1}]),/Invalid price/)})
