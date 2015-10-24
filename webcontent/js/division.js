/**
 * @constructor
 * @param {crisisJson.Division} divJson
 * @implements {crisis.Updateable<crisisJson.Division>}
 */
crisis.Division = function(divJson) {
    var div = this;

    /** @type {crisis.DivisionDetails} */
    this.details = new crisis.DivisionDetails(this);
    /** @type {boolean} */
    this.editing = false;
    /** @type {number} */
    this.id = divJson.Id;
    /** @type {crisis.Coords} */
    this.absCoords;
    /** @type {Array<crisis.Unit>} */
    this.units = [];
    /** @type {string} */
    this.name;
    /** @type {number} */
    this.factionId;
    /** @type {jQuery} */
    this.$marker = crisis.cloneProto(crisis.prototypes.$protoDivisionMarker);

    this.update(divJson);
    this.$marker.click(function() { div.details.toggle(); });

    crisis.map.addAt(this.$marker, this.absCoords);
};

/**
 * @param {crisisJson.Division} divJson
 * @return {crisis.Division}
 */
crisis.Division.fromJson = function(divJson) {
    return new crisis.Division(divJson);
};

/** @inheritDoc */
crisis.Division.prototype.update = function(divJson) {
    var div = this;

    div.absCoords = crisis.Coords.fromJson(divJson.Coords);
    div.name = divJson.Name;
    div.factionId = divJson.FactionId;
    crisis.updateElements(div.units, divJson.Units,
        function(data) { return new crisis.Unit(data, div); });

    if (div.details.isOpen) {
        div.details.reRender();
    } else {
        div.details.unRendered = true;
    }
    crisis.map.position(div.$marker, div.absCoords);
    if (div.details.isOpen) {
        crisis.map.positionDropdown(div.details.$pane, div.$marker);
    }
};

/** @inheritDoc */
crisis.Division.prototype.updateDataMatch = function(data) {
    return this.id === data.Id;
};

crisis.Division.prototype.destroy = function() {
    this.$marker.remove();
    this.details.$pane.remove();
};

/** @param {crisis.Unit} unit */
crisis.Division.prototype.removeUnit = function(unit) {
    this.units = _.without(this.units, unit);
};

crisis.Division.prototype.position = function() {
    var rel = crisis.map.relativeCoordsOfAbs(this.absCoords);
    this.$marker.css({
        'left': rel.x + '%',
        'top': rel.y + '%'
    });
}
