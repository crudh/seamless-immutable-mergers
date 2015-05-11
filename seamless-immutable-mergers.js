"use strict";
var immutable = require("immutable");

function concatArrayMerger(current, other) {
  if (!(current instanceof Array) || !(other instanceof Array)) return;

  return current.concat(other);
}

function updatingDiffArrayMerger(current, other, config) {
  if (!(current instanceof Array) || !(other instanceof Array)) return;
  if (current.length === 0 || other.length === 0) return;

  var identifier = config.diffArrayMergerIdentifier;
  if (current[0] === null || !(typeof current[0] === "object") || !current[0][identifier]) return;
  if (other[0] === null || !(typeof other[0] === "object") || !other[0][identifier]) return;

  var currentMap = {};
  for (var i = 0; i < current.length; i++) {
    currentMap[current[i][identifier]] = i;
  }

  var resultList = current.asMutable();
  for (var j = 0; j < other.length; j++) {
    var matchingCurrentIndex = currentMap[other[j][identifier]];

    if (!matchingCurrentIndex) {
      resultList.push(other[j]);
    } else {
      resultList[matchingCurrentIndex] = resultList[matchingCurrentIndex].merge(other[j], config);
    }
  }

  return immutable(resultList);
}

// Export the library
var immutableMergers = {
  concatArrayMerger: concatArrayMerger,
  updatingDiffArrayMerger: updatingDiffArrayMerger
};

Object.freeze(immutableMergers);

module.exports = immutableMergers;
