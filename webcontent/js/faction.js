/**
 * @constructor
 * @param {crisisJson.Faction} json
 * @param {boolean} forCreation
 * @implements {crisis.Updateable<crisisJson.Faction>}
 */
crisis.Faction = function(json, forCreation) {
    /** @type {number} */
    this.id = json.Id;
    /** @type {string} */
    this.name = json.Name;
    /** @type {buckets.Set<crisis.Faction.ChangeListener>} */
    this.listeners = new buckets.Set(function(l) { return l.listenerId(); });
    /** @type {crisis.FactionLi} */
    this.factionLi = new crisis.FactionLi(this, forCreation);
};

/**
 * @param {crisisJson.Faction} factionJson
 * @return {crisis.Faction}
 */
crisis.Faction.fromJson = function(factionJson) {
    return new crisis.Faction(factionJson, false);
};

/** @interface */
crisis.Faction.ChangeListener = function() {};
/** @param {crisis.Faction} fac */
crisis.Faction.ChangeListener.prototype.factionChanged = function(fac) {};
/** @return {string} */
crisis.Faction.ChangeListener.prototype.listenerId = function() {};

/** @param {crisisJson.Faction} json */
crisis.Faction.prototype.update = function(json) {
    /** @type {crisis.Faction} */
    var thisFac = this;
    
    if (this.id !== json.Id) {
        console.log('Faction.update: mismatched data');
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
            listener.factionChanged(thisFac);
        });
    }
};

crisis.Faction.prototype.destroy = function() {
    this.factionLi.destroy();
    crisis.factions.remove(this.id);
};
