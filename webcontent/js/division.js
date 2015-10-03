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
    this.reRender = true;
    /** @type {boolean} */
    this.editing = false;
    /** @type {number} */
    this.id = divJson.Id;
    /** @type {crisis.Coords} */
    this.abscoords;
    /** @type {Array<crisis.Unit>} */
    this.units;
    /** @type {string} */
    this.name;
    /** @type {number} */
    this.factionId;
    /** @type {jQuery} */
    this.$marker = crisis.cloneProto(crisis.$protoDivisionMarker);

    this.update(divJson);
    this.$marker.click(function() { div.details.toggle(); });

    crisis.map.$holder.append(this.$marker);
};

/** @param {crisisJson.Division} divJson */
crisis.Division.prototype.update = function(divJson) {
    var div = this;

    div.absCoords = crisis.Coords.fromJson(divJson.Coords);
    div.name = divJson.Name;
    div.units = /** @type {Array<crisis.Unit>} */
        (_.map(divJson.Units, function(unitJson) {
        return new crisis.Unit(unitJson, div);
    }));
    div.reRender = true;

    div.position();
};

crisis.Division.prototype.position = function() {
    var rel = crisis.map.relativeCoordsOfAbs(this.absCoords);
    this.$marker.css({
        'left': rel.x + '%',
        'top': rel.y + '%'
    });
};

crisis.Division.prototype.destroy = function() {
    this.$marker.remove();
    this.details.$pane.remove();
};
