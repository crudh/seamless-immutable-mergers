"use strict";
var assert    = require("chai").assert;
var immutable = require("seamless-immutable");
var merger    = require("../seamless-immutable-mergers").ignoreArrayMerger;

describe("IgnoreArrayMerger", function() {
  var config = {
    deep: true,
    merger: merger
  };

  it("merges like a normal merge with everything except arrays", function() {
    var current = immutable({
      number: 1,
      string: "One",
      date: new Date(),
      object: {
        id: "object1"
      }
    });

    var update = {
      number: 2,
      string: "Two",
      date: new Date(),
      object: {
        id: "object2"
      }
    };

    var resultNormal = current.merge(update);
    var resultMerger = current.merge(update, config);

    assert.deepEqual(resultNormal, resultMerger);
  });

  it("merges like a normal merge when there aren't two arrays to merge", function() {
    var current = immutable({
      arrayOne: [1, 3, 5]
    });

    var update = {
      arrayTwo: [2, 4]
    };

    var resultNormal = current.merge(update);
    var resultMerger = current.merge(update, config);

    assert.deepEqual(resultNormal, resultMerger);
  });

  it("merges arrays by keeping the current", function() {
    var current = immutable({
      arrayOne: [1, 3, 5],
      arrayTwo: ["a", "c", "e"],
      arrayThree: [1, 3, 5],
      arrayFour: []
    });

    var update = {
      arrayOne: [2, 4],
      arrayTwo: ["b", "d", "f"],
      arrayThree: [],
      arrayFour: [2, 4]
    };

    var result = current.merge(update, config);

    assert.equal(result.arrayOne, current.arrayOne);
    assert.equal(result.arrayTwo, current.arrayTwo);
    assert.equal(result.arrayThree, current.arrayThree);
    assert.equal(result.arrayFour, current.arrayFour);
  });

  it("merges arrays deep by concatenating them togheter", function() {
    var current = immutable({
      array: [1],
      sub: {
        arrayOne: [1, 3, 5],
        arrayTwo: ["a", "c", "e"],
        arrayThree: [1, 3, 5],
        arrayFour: []
      }
    });

    var update = {
      array: [2],
      sub: {
        arrayOne: [2, 4],
        arrayTwo: ["b", "d", "f"],
        arrayThree: [],
        arrayFour: [2, 4]
      }
    };

    var result = current.merge(update, config);

    assert.equal(result.array, current.array);
    assert.equal(result.sub.arrayOne, current.sub.arrayOne);
    assert.equal(result.sub.arrayTwo, current.sub.arrayTwo);
    assert.equal(result.sub.arrayThree, current.sub.arrayThree);
    assert.equal(result.sub.arrayFour, current.sub.arrayFour);
  });
});
