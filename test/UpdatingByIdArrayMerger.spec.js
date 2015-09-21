"use strict";
var assert    = require("chai").assert;
var immutable = require("seamless-immutable");
var merger    = require("../seamless-immutable-mergers").updatingByIdArrayMerger;

describe("UpdatingByIdArrayMerger", function() {
  var config = {
    deep: true,
    merger: merger,
    mergerObjectIdentifier: "id"
  };

  function compareTestObjects(obj1, obj2) {
    assert.equal(obj1.id, obj2.id);
    assert.equal(obj1.data, obj2.data);
  }

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

  it("merges like a normal merge when there aren't two arrays with objects that contains the specified id", function() {
    var current = immutable({
      arrayOne: [1, 3, 5],
      arrayTwo: [],
      arrayThree: [{data: 1}],
      arrayFour: [{id: 1, data: 2}],
      arrayFive: []
    });

    var update = {
      arrayOne: [2, 4],
      arrayTwo: [5, 5],
      arrayThree: [{data: 2}, {data: 4}],
      arrayFour: [{id: 1, data: 3}, {id: 2, data: 4}],
      arrayFive: [{id: 1, data: 2}]
    };

    var result = current.merge(update, config);

    assert.sameMembers(result.arrayOne, [2, 4]);
    assert.sameMembers(result.arrayTwo, [5, 5]);

    assert.equal(result.arrayThree.length, 2);
    compareTestObjects(result.arrayThree[0], update.arrayThree[0]);
    compareTestObjects(result.arrayThree[1], update.arrayThree[1]);

    assert.equal(result.arrayFour.length, 2);
    compareTestObjects(result.arrayFour[0], update.arrayFour[0]);
    compareTestObjects(result.arrayFour[1], update.arrayFour[1]);

    assert.equal(result.arrayFive.length, 1);
    compareTestObjects(result.arrayFive[0], update.arrayFive[0]);
  });

  it("correctly merges objects in arrays", function() {
    var current = immutable({
      array: [
        {
          id: 10,
          status: "ok",
          content: "text"
        }
      ]
    });

    var update = {
      array: [
        {
          id: 10,
          status: "fail"
        },
        {
          id: 11,
          status: "ok",
          content: "media"
        }
      ]
    };

    var result = current.merge(update, config);
    assert.equal(result.array.length, 2);

    var firstObject = result.array[0];
    assert.equal(firstObject.id, 10);
    assert.equal(firstObject.status, "fail");
    assert.equal(firstObject.content, "text");

    var secondObject = result.array[1];
    assert.equal(secondObject.id, 11);
    assert.equal(secondObject.status, "ok");
    assert.equal(secondObject.content, "media");
  });

  it("deeply merges arrays in merged objects", function() {
    var current = immutable({
      array: [
        {
          id: 10,
          status: "ok",
          content: "text",
          items: [
            {
              id: 100,
              status: "ok",
              content: "text"
            }
          ]
        }
      ]
    });

    var update = {
      array: [
        {
          id: 10,
          items: [
            {
              id: 101,
              status: "ok",
              content: "media"
            },
            {
              id: 100,
              status: "fail"
            }
          ]
        }
      ]
    };

    var result = current.merge(update, config);
    assert.equal(result.array.length, 1);

    var resultObject = result.array[0];
    assert.equal(resultObject.id, 10);
    assert.equal(resultObject.status, "ok");
    assert.equal(resultObject.content, "text");

    var items = resultObject.items;
    assert.equal(items.length, 2);

    assert.equal(items[0].id, 100);
    assert.equal(items[0].status, "fail");
    assert.equal(items[0].content, "text");

    assert.equal(items[1].id, 101);
    assert.equal(items[1].status, "ok");
    assert.equal(items[1].content, "media");
  });

  it("doesn't empty an array when the push contains an empty array", function() {
    var current = immutable({
      array: [
        {
          id: 10,
          status: "ok",
          content: "text",
          items: [
            {
              id: 100,
              status: "ok",
              content: "text"
            }
          ]
        }
      ]
    });

    var update = {
      array: []
    };

    var result = current.merge(update, config);
    assert.equal(result.array.length, 1);
  });

  it("doesn't deeply empty an array when the push contains an empty array", function() {
    var current = immutable({
      array: [
        {
          id: 10,
          status: "ok",
          content: "text",
          items: [
            {
              id: 100,
              status: "ok",
              content: "text"
            }
          ]
        }
      ]
    });

    var update = {
      array: [
        {
          id: 10,
          items: []
        }
      ]
    };

    var result = current.merge(update, config);
    assert.equal(result.array.length, 1);

    var resultObject = result.array[0];
    var items = resultObject.items;
    assert.equal(items.length, 1);
  });
});
