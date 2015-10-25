/**
 * @constructor
 * @param {crisisJson.Division} divJson
 * @implements {crisis.Updateable<crisisJson.Division>}
 */
crisis.Division = function(divJson) {
    /** @type {crisis.Division} */
    var div = this;
    /** @type {buckets.Set<crisis.Division.ChangeListener>} */
    this.listeners = new buckets.Set(function(l) { return l.listenerId(); });

    /** @type {crisis.DivisionDetails} */
    this.details = new crisis.DivisionDetails(this);
    /** @type {boolean} */
    this.editing = false;
    /** @type {number} */
    this.id = divJson.Id;
    /** @type {crisis.Coords} */
    this.absCoords;
    /** @type {buckets.Dictionary<number, crisis.Unit>} */
    this.units = new buckets.Dictionary();
    /** @type {string} */
    this.name;
    /** @type {number} */
    this.factionId;
    /** @type {jQuery} */
    this.$marker = crisis.cloneProto(crisis.prototypes.$divisionMarker);

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

/** @interface */
crisis.Division.ChangeListener = function() {};
/** @param {crisis.Division} fac */
crisis.Division.ChangeListener.prototype.divisionChanged = function(fac) {};
/** @return {string} */
crisis.Division.ChangeListener.prototype.listenerId = function() {};

/** @inheritDoc */
crisis.Division.prototype.update = function(divJson) {
    /** @type {crisis.Division} */
    var thisDiv = this;
    /** @type {boolean} */
    var changed = false;

    if (this.absCoords === undefined ||
        !this.absCoords.equals(crisis.Coords.fromJson(divJson.Coords)))
    {
        changed = true;
        this.absCoords = crisis.Coords.fromJson(divJson.Coords);
    }

    if (this.name !== divJson.Name) {
        changed = true;
        this.name = divJson.Name;
    }

    if (this.factionId !== divJson.FactionId) {
        changed = true;
        this.factionId = divJson.FactionId;
    }
    
    crisis.updateElements(
        this.units, divJson.Units,
        function(json) { return new crisis.Unit(json, thisDiv); },
        function(json) { return json.Type; }
    );

    crisis.map.position(this.$marker, this.absCoords);
    if (this.details.isOpen) {
        crisis.map.positionDropdown(this.details.$pane, this.$marker);
    }

    if (changed) {
        this.listeners.forEach(function(listener) {
            listener.divisionChanged(thisDiv);
        });
    }
};

crisis.Division.prototype.destroy = function() {
    this.$marker.remove();
    this.details.destroy();
};

/** @param {crisis.Unit} unit */
crisis.Division.prototype.removeUnit = function(unit) {
    this.units.remove(unit.type);
};

crisis.Division.prototype.position = function() {
    var rel = crisis.map.relativeCoordsOfAbs(this.absCoords);
    this.$marker.css({
        'left': rel.x + '%',
        'top': rel.y + '%'
    });
};

crisis.Division.prototype.reRender = function() {
    this.position();
    this.details.reRender();
};
