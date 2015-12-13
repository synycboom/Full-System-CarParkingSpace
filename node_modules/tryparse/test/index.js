var test = require('tap').test
var tryparse = require('../index.js')
test("if a integer is correctly returned", function (t) {
  t.equal(tryparse.int(4), 4, "Is Integer")
  t.end()
})

test("if a integer string is correctly returned", function (t) {
  t.equal(tryparse.int("4"), 4, "Is Integer string")
  t.end()
})

test("if a float is correctly returned", function (t) {
  t.equal(tryparse.float(4.5), 4.5, "Is Float")
  t.end()
})

test("if a float string is correctly returned", function (t) {
  t.equal(tryparse.float("4.5"), 4.5, "Is Float string")
  t.end()
})

test("if a non-integer is returned as null on tryparse.int", function (t) {
  t.equal(tryparse.int('s'), null, "Is Not Integer")
  t.end()
})

test("if a non-float is return as null on tryparse.float", function (t) {
  t.equal(tryparse.float('4q'), null, "Is Not a Float")
  t.end()
})