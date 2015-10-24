/**
 * @constructor
 * @param {crisis.Coords} coords
 */
crisis.RoutePoint = function(coords) {
    /** @type {crisis.Coords} */
    this.coords = coords;
    /** @type {jQuery} */
    this.$routePoint = crisis.cloneProto(crisis.prototypes.$protoRoutePoint);

    crisis.map.addAt(this.$routePoint, this.coords);
};

crisis.RoutePoint.prototype.destroy = function() {
    this.$routePoint.remove();
};
