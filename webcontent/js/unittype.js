/**
 * @constructor
 * @param {crisisJson.UnitType} json
 * @param {boolean} forCreation
 * @implements {crisis.Updateable<crisisJson.UnitType>}
 */
crisis.UnitType = function(json, forCreation) {
    /** @type {number} */
    this.id = json.Id;
    /** @type {string} */
    this.name = json.Name;
    /** @type {buckets.Set<crisis.UnitType.ChangeListener>} */
    this.listeners = new buckets.Set(function(l) { return l.listenerId(); });
    /** @type {crisis.UnitTypeLi} */
    this.unitTypeLi = new crisis.UnitTypeLi(this, forCreation);
};

/**
 * @param {crisisJson.UnitType} unitTypeJson
 * @return {crisis.UnitType}
 */
crisis.UnitType.fromJson = function(unitTypeJson) {
    return new crisis.UnitType(unitTypeJson, false);
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
