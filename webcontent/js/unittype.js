/**
 * @constructor
 * @param {crisisJson.UnitType} json
 * @implements {crisis.Updateable<crisisJson.UnitType>}
 */
crisis.UnitType = function(json) {
    /** @type {number} */
    this.id = json.Id;
    /** @type {string} */
    this.name = json.Name;
    /** @type {crisis.UnitTypeLi} */
    this.unitTypeLi = new crisis.UnitTypeLi(this);
};

/**
 * @param {crisisJson.UnitType} unitTypeJson
 * @return {crisis.UnitType}
 */
crisis.UnitType.fromJson = function(unitTypeJson) {
    return new crisis.UnitType(unitTypeJson);
};

/** @param {crisisJson.UnitType} json */
crisis.UnitType.prototype.update = function(json) {
    if (this.id !== json.Id) {
        console.log('UnitType.update: mismatched data');
        return;
    }

    this.name = json.Name;
    this.unitTypeLi.update();
};

crisis.UnitType.prototype.destroy = function() {
    this.unitTypeLi.destroy();
    crisis.unitTypes = _.without(crisis.unitTypes, this);
};
