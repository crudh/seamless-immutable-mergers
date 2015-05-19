seamless-immutable-mergers
==========================
This contains a set of custom mergers for the [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) library. It is mainly a showcase for what can be done with custom mergers, but the mergers are hopefully useful on their own.

## The merge API
If you have an immutable object that you want to merge with another object then you do the following in seamless-immutable:

```javascript
var result = immutableObject.merge(otherObject);
```

All properties in `otherObject` will be added to `immutableObject` overwriting any duplicates. Properties in
`immutableObject` that aren't in `otherObject` will be left as is.

### Deep merge
You can also pass in configuration to the merge process. For example using the deep option:

```javascript
var result = immutableObject.merge(otherObject, {deep: true});
```

This will recursively merge all properties that are objects and exists in both the source and target instead of replacing.

### Custom mergers
You can also pass in a custom merger that overrides the normal merge process. For example:

```javascript
var result = immutableObject.merge(otherObject, {merger: myCustomMerger});
```

A merger is a function that takes the property for the current object, the property for the other object and optionally the config object. Example:

```javascript
function myCustomMerger(current, other, config) {
  return undefined;
}
```

If the merge returns undefined then the merge continues like normal. If the merger returns something than that result is used instead. So checks can be added so a custom merger only operates on specific input, like arrays.

## Supplied mergers
### concatArrayMerger
This is a simple merger that instead of replacing an array with another concats them together. Example:

```javascript
immutable = require("seamless-immutable");
mergers = reuqire("seamless-immutable-mergers");

var immutableObject = immutable({
  title: "one",
  items: [1, 2]
});

var otherObject = {
  title: "two",
  items: [3, 4]
};

var result = immutableObject.merge(otherObject, {merger: myCustomMerger});
```

The result will be:
```javascript
{
  title: "two",
  items: [1, 2, 3, 4]
}
```


