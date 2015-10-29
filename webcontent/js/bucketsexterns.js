/** @externs */

var buckets = {};

/**
 * @constructor
 * @template T
 * @param {function(T): string=} toStringFunction
 */
buckets.Set = function(toStringFunction) {};

/** @param {T} element */
buckets.Set.prototype.add = function(element) {};

/** @param {T} element */
buckets.Set.prototype.remove = function(element) {};

/** @param {function(T)} callback */
buckets.Set.prototype.forEach = function(callback) {};

/**
 * @param {buckets.Set<T>} other
 * @return {boolean}
 */
buckets.Set.prototype.equals = function(other) {};

/**
 * @param {T} elem
 * @return {boolean}
 */
buckets.Set.prototype.contains = function(elem) {};

/**
 * @constructor
 * @template K, V
 * @param {function(K): string=} toStringFunction
 */
buckets.Dictionary = function(toStringFunction) {};

/**
 * @param {K} key
 * @param {V} value
 */
buckets.Dictionary.prototype.set = function(key, value) {};

/**
 * @param {K} key
 * @return {V}
 */
buckets.Dictionary.prototype.get = function(key) {};

/** @param {K} key */
buckets.Dictionary.prototype.containsKey = function(key) {};

/** @param {K} key */
buckets.Dictionary.prototype.remove = function(key) {};

/** @param {function(K,V)} callback */
buckets.Dictionary.prototype.forEach = function(callback) {};

/** @return {Array<V>} */
buckets.Dictionary.prototype.values = function() {};

buckets.Dictionary.prototype.clear = function() {};
