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

    /** @type {crisis.DivisionMapMarker} */
    this.mapMarker = new crisis.DivisionMapMarker(this);
    /** @type {crisis.DivisionDetails} */
    this.details = crisis.DivisionDetails.fromDivision(this);
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

    this.update(divJson);
    crisis.divisionsListeners.forEach(function(l) { l.modelAdded(div); });
    this.details.init();
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
/** @param {crisis.Division} div */
crisis.Division.ChangeListener.prototype.divisionChanged = function(div) {};
crisis.Division.ChangeListener.prototype.divisionDestroyed = function() {};
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

    if (changed) {
        this.listeners.forEach(function(listener) {
            listener.divisionChanged(thisDiv);
        });
    }
};

crisis.Division.prototype.destroy = function() {
    this.details.destroy();
};

/** @param {crisis.Unit} unit */
crisis.Division.prototype.removeUnit = function(unit) {
    this.units.remove(unit.type);
};
