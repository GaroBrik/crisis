/**
 * @constructor
 * @param {crisisJson.Division} divJson
 */
crisis.Division = function(divJson) {
    var div = this;

    console.log(divJson);

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

    this.updateData(divJson);
    this.$marker.click(function() { div.details.toggle(); });

    crisis.map.$holder.append(this.$marker);
};

/** @param {crisisJson.Division} divJson */
crisis.Division.prototype.updateData = function(divJson) {
    var div = this;

    div.absCoords = crisis.Coords.fromJson(divJson.AbsCoords);

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
