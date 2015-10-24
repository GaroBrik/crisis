/**
 * @constructor
 * @param {crisisJson.Faction} json
 * @implements {crisis.Updateable<crisisJson.Faction>}
 */
crisis.Faction = function(json) {
    /** @type {number} */
    this.id = json.Id;
    /** @type {string} */
    this.name = json.Name;
    /** @type {crisis.FactionLi} */
    this.factionLi = new crisis.FactionLi(this);
};

/**
 * @param {crisisJson.Faction} factionJson
 * @return {crisis.Faction}
 */
crisis.Faction.fromJson = function(factionJson) {
    return new crisis.Faction(factionJson);
};

/** @param {crisisJson.Faction} json */
crisis.Faction.prototype.update = function(json) {
    if (this.id !== json.Id) {
        console.log('Faction.update: mismatched data');
        return;
    }

    this.name = json.Name;
    this.factionLi.update();
};

crisis.Faction.prototype.destroy = function() {
    this.factionLi.destroy();
    crisis.factions = _.without(crisis.factions, this);
};
