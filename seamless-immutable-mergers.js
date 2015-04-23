(function(){
  "use strict";

  function concatArrayMerger(current, other) {
    if (!(current instanceof Array) || !(other instanceof Array)) return;

    return current.concat(other);
  }

  function updatingDiffArrayMerger(current, other, config) {
    if (!(current instanceof Array) || !(other instanceof Array)) return;
    if (current.length === 0 || other.length === 0) return;
    if (current[0] === null || !(typeof current[0] === 'object') || !current[0][config.diffArrayMergerIdentifier]) return;
    if (other[0] === null || !(typeof other[0] === 'object') || !other[0][config.diffArrayMergerIdentifier]) return;

    var currentMap = {};
    for (var i = 0; i < current.length; i++) {
      currentMap[current[i][config.diffArrayMergerIdentifier]] = i;
    }

    var resultList = current.asMutable();
    for (var j = 0; j < other.length; j++) {
      var matchingCurrentIndex = currentMap[other[j][config.diffArrayMergerIdentifier]];

      if (!matchingCurrentIndex) {
        resultList.push(other[j]);
      } else {
        resultList[matchingCurrentIndex] = resultList[matchingCurrentIndex].merge(other[j], config);
      }
    }

    return Immutable(resultList);
  }

  // Export the library
  var ImmutableMergers = {
    concatArrayMerger: concatArrayMerger,
    updatingDiffArrayMerger: updatingDiffArrayMerger
  };

  Object.freeze(ImmutableMergers);

  if (typeof module === "object") {
    module.exports = ImmutableMergers;
  } else if (typeof exports === "object") {
    exports.Immutable = ImmutableMergers;
  } else if (typeof window === "object") {
    window.Immutable = ImmutableMergers;
  } else if (typeof global === "object") {
    global.Immutable = ImmutableMergers;
  }
})();
