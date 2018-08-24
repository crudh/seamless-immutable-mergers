"use strict";
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['seamless-immutable'], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('seamless-immutable'));
  } else {
    root.returnExports = factory(root.b);
  }
}(this, function (immutable) {
  function concatArrayMerger(current, other) {
    if (!(current instanceof Array) || !(other instanceof Array)) return;

    return current.concat(other);
  }

  function equalityArrayMerger(current, other) {
    if (!(current instanceof Array) || !(other instanceof Array)) return;
    if (current.length !== other.length) return;

    for (var i = 0; i < current.length; i++) {
      if (current[i] !== other[i]) return;
    }

    return current;
  }

  function ignoreArrayMerger(current, other) {
    if (!(current instanceof Array) || !(other instanceof Array)) return;

    return current;
  }

  function updatingByIdArrayMerger(current, other, config) {
    if (!(current instanceof Array) || !(other instanceof Array)) return;
    if (current.length === 0) return;
    if (other.length === 0) return current;

    var identifier = config.mergerObjectIdentifier;
    if (current[0] === null || !(typeof current[0] === "object") || !current[0][identifier]) return;
    if (other[0] === null || !(typeof other[0] === "object") || !other[0][identifier]) return;

    var currentMap = {};
    for (var i = 0; i < current.length; i++) {
      currentMap[current[i][identifier]] = i;
    }

    var resultList = current.asMutable();
    for (var j = 0; j < other.length; j++) {
      var matchingCurrentIndex = currentMap[other[j][identifier]];

      if (matchingCurrentIndex === undefined) {
        var modifier = config.modifier;
        if (modifier !== 'push' && modifier !== 'unshift')
          modifier = 'push';
        resultList[modifier](other[j]);
      } else {
        resultList[matchingCurrentIndex] = resultList[matchingCurrentIndex].merge(other[j], config);
      }
    }

    return immutable(resultList);
  }

  // Export the library
  var immutableMergers = {
    concatArrayMerger: concatArrayMerger,
    equalityArrayMerger: equalityArrayMerger,
    ignoreArrayMerger: ignoreArrayMerger,
    updatingByIdArrayMerger: updatingByIdArrayMerger
  };

  Object.freeze(immutableMergers);

  return immutableMergers;
}));
