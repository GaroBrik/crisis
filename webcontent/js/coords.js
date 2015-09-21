/**
 * @constructor
 * @param {number} ix
 * @param {number} iy
 */
crisis.Coords = function(ix, iy) {
    /** @type {number} */
    this.x = x;
    /** @type {number} */
    this.y = y;
};

/** @return {crisisJson.Coords} */
crisis.Coords.prototype.toJson = function() {
    return {
        X: this.x,
        Y: this.y
    };
};

/**
 * @param {crisisJson.Coords} json
 * @return {crisis.Coords}
 */
crisis.Coords.fromJson = function(json) {
    return new crisis.Coords(json.X, json.Y);
}
