/**
 * @constructor
 * @param {crisisJson.Faction} json
 * @implements {crisis.Updateable<crisisJson.Faction>}
 */
crisis.Faction = function(json) {
    /** @type {crisis.Faction} */
    var thisFac = this;
    
    /** @type {number} */
    this.id = json.Id;
    /** @type {string} */
    this.name = json.Name;
    /** @type {buckets.Set<crisis.Faction.ChangeListener>} */
    this.listeners = new buckets.Set(function(l) { return l.listenerId(); });
    /** @type {crisis.FactionLi} */
    this.factionLi = new crisis.FactionLi(this, false);

    crisis.factionsListeners.forEach(function(l) { l.modelAdded(thisFac); });
};

/**
 * @param {crisisJson.Faction} factionJson
 * @return {crisis.Faction}
 */
crisis.Faction.fromJson = function(factionJson) {
    return new crisis.Faction(factionJson);
};

/** @interface */
crisis.Faction.ChangeListener = function() {};
/** @param {crisis.Faction} fac */
crisis.Faction.ChangeListener.prototype.factionChanged = function(fac) {};
/** @param {number} facId */
crisis.Faction.ChangeListener.prototype.factionDestroyed = function(facId) {};
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
    /** @type {crisis.Faction} */
    var thisFac = this;
    
    this.listeners.forEach(function(listener) {
        listener.factionDestroyed(thisFac.id);
    });
    crisis.factions.remove(this.id);
};
