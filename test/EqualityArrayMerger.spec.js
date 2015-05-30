"use strict";
var assert    = require("chai").assert;
var immutable = require("seamless-immutable");
var merger    = require("../seamless-immutable-mergers").equalityArrayMerger;

describe("EqualityArrayMerger", function() {
  var config = {
    merger: merger
  };

  it("gives the same reference back if the arrays contains the same items", function() {
    var data = {a: [1, 2]}
    var data2 = data;
    assert.equal(data, data2);

    var current = immutable(data);
    var resultWithoutMerger = current.merge(data2);
    assert.notEqual(current, resultWithoutMerger);

    var resultWithMerger = current.merge(data2, config);
    assert.equal(current, resultWithMerger);
  });

  it("doesn't give the same reference back if the arrays contains different items", function() {
    var data = {a: [1, 2]}
    var data2 = {a: [2,1]};
    assert.notEqual(data, data2);

    var current = immutable(data);
    var resultWithoutMerger = current.merge(data2);
    assert.notEqual(current, resultWithoutMerger);

    var resultWithMerger = current.merge(data2, config);
    assert.notEqual(current, resultWithMerger);
  });
});
