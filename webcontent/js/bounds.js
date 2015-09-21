/**
 * @constructor
 * @param {number} width
 * @param {number} height
 */
crisis.Bounds = function(width, height) {
    /** @type {number} */
    this.width = width;
    /** @type {number} */
    this.height = height;
};

/** @return {crisisJson.Bounds} */
crisis.Bounds.prototype.toJson = function() {
    return {
        Width: this.width,
        Height: this.height
    };
};

/**
 * @param {crisisJson.Bounds} json
 * @return {crisis.Bounds}
 */
crisis.Bounds.fromJson = function(json) {
    return new crisis.Bounds(json.Width, json.Height);
}
