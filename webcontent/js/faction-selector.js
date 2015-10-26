/**
 * @constructor
 * @implements {crisis.Faction.ChangeListener}
 * @implements {crisis.ModelChangeListener<crisis.Faction>}
 */
crisis.FactionSelector = function(uuid) {
    /** @type {crisis.FactionSelector} */
    var thisSelector = this;
    
    /** @type {jQuery} */
    this.$selector = crisis.cloneProto(crisis.prototypes.$factionSelector);
    /** @type {buckets.Dictionary<number, jQuery>} */
    this.options = new buckets.Dictionary();

    /**
     * @override
     * @param {crisis.Faction} faction
     */
    this.factionChanged = function(faction) {
        this.options.get(faction.id).text(faction.name);
    };

    /**
     * @override
     * @param {number} facId
     */
    this.factionDestroyed = function(facId) {
        this.options.get(facId).remove();
        this.options.remove(facId);
    };

    /**
     * @override
     * @param {crisis.Faction} fac
     */
    this.modelAdded = function(fac) {
        var newOption = /** @type {jQuery} */
            ($('<option/>').val(fac.id.toString()).text(fac.name))
        thisSelector.options.set(fac.id, newOption);
        fac.listeners.add(thisSelector);
        thisSelector.$selector.append(newOption);
    };
 
    if (uuid === undefined) {
        uuid = 'factionSelector(' + (new Date).getTime() + ')';
    }
    /**
     * @override
     * @return {string}
     */
    this.listenerId = function() {
        return uuid;
    };

    this.destroy = function() {
        this.$selector.remove();
        this.options.forEach(function(facId) {
            crisis.getFaction(facId).listeners.remove(this);
        });
        crisis.factionsListeners.remove(this);
    };

    /** @return {number} */
    this.getSelectedFaction = function() {
        return crisis.stringToInt(/** @type {string} */ (this.$selector.val()));
    };

    /** @param {number} factionId */
    this.setSelectedFaction = function(factionId) {
        this.$selector.val(factionId.toString());
    };
    
    crisis.factions.forEach(function(id, faction) {
        thisSelector.modelAdded(faction);
    });
    crisis.factionsListeners.add(this);
};
