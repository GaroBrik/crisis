/**
 * @constructor
 * @param {crisisJson.UnitType} json
 * @implements {crisis.Updateable<crisisJson.UnitType>}
 */
crisis.UnitType = function(json) {
    /** @type {crisis.UnitType} */
    var thisType = this;

    /** @type {number} */
    this.id = json.Id;
    /** @type {string} */
    this.name = json.Name;
    /** @type {number} */
    this.speed = json.Speed;
    /** @type {buckets.Set<crisis.UnitType.ChangeListener>} */
    this.listeners = new buckets.Set(function(l) { return l.listenerId(); });
    /** @type {crisis.UnitTypeLi} */
    this.unitTypeLi = new crisis.UnitTypeLi(this, false);

    crisis.unitTypesListeners.forEach(function(l) { l.modelAdded(thisType); });
};

/**
 * @param {crisisJson.UnitType} unitTypeJson
 * @return {crisis.UnitType}
 */
crisis.UnitType.fromJson = function(unitTypeJson) {
    return new crisis.UnitType(unitTypeJson);
};

/** @interface */
crisis.UnitType.ChangeListener = function() {};
/** @param {crisis.UnitType} unitType */
crisis.UnitType.ChangeListener.prototype.unitTypeChanged = function(unitType) {};
/** @return {string} */
crisis.UnitType.ChangeListener.prototype.listenerId = function() {};

/** @param {crisisJson.UnitType} json */
crisis.UnitType.prototype.update = function(json) {
    /** @type {crisis.UnitType} */
    var thisType = this;

    if (this.id !== json.Id) {
        console.log('UnitType.update: mismatched data');
        return;
    }

    /** @type {boolean} */
    var changed = false;

    if (this.name !== json.Name) {
        changed = true;
        this.name = json.Name;
    }

    if (this.speed !== json.Speed) {
        changed = true;
        this.speed = json.Speed;
    }

    if (changed) {
        this.listeners.forEach(function(listener) {
            listener.unitTypeChanged(thisType);
        });
    }
};

crisis.UnitType.prototype.destroy = function() {
    this.unitTypeLi.destroy();
    crisis.removeUnitType(this.id);
};
