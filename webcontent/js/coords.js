/**
 * @constructor
 * @param {number} x
 * @param {number} y
 */
crisis.Coords = function(x, y) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
};

/**
 * @param {crisisJson.Coords} json
 * @return {crisis.Coords}
 */
crisis.Coords.fromJson = function(json) {
    return new crisis.Coords(json.X, json.Y);
};

/** @return {crisisJson.Coords} */
crisis.Coords.prototype.toJson = function() {
    return {
        X: this.x,
        Y: this.y
    };
};

/**
 * @param {crisis.Coords} other
 * @return {boolean}
 */
crisis.Coords.prototype.equals = function(other) {
    return this.x === other.x && this.y === other.y;
};
