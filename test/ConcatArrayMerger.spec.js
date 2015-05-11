"use strict";
var assert    = require("chai").assert;
var immutable = require("seamless-immutable");
var merger    = require("../seamless-immutable-mergers").concatArrayMerger;

describe("ConcatArrayMerger", function() {
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

  it("merges arrays by concatenating them togheter", function() {
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

    assert.sameMembers(result.arrayOne, [1, 3, 5, 2, 4]);
    assert.sameMembers(result.arrayTwo, ["a", "c", "e", "b", "d", "f"]);
    assert.sameMembers(result.arrayThree, [1, 3, 5]);
    assert.sameMembers(result.arrayFour, [2, 4]);
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

    assert.sameMembers(result.array, [1,2]);
    assert.sameMembers(result.sub.arrayOne, [1, 3, 5, 2, 4]);
    assert.sameMembers(result.sub.arrayTwo, ["a", "c", "e", "b", "d", "f"]);
    assert.sameMembers(result.sub.arrayThree, [1, 3, 5]);
    assert.sameMembers(result.sub.arrayFour, [2, 4]);
  });
});
