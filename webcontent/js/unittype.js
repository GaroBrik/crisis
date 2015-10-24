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

/** @param {crisisJson.UnitType} json */
crisis.UnitType.prototype.update = function(json) {
    if (this.id !== json.Id) {
        console.log('UnitType.update: mismatched data');
        return;
    }

    this.name = json.Name;
    this.unitTypeLi.reRender();
};

crisis.UnitType.prototype.destroy = function() {
    this.unitTypeLi.destroy();
    crisis.unitTypes = _.without(crisis.unitTypes, this);
};

/** @param {crisisJson.UnitType} json */
crisis.UnitType.prototype.updateDataMatch = function(json) {
    return this.id === json.Id;
};
