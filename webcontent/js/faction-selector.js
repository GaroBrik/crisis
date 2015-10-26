/**
 * @constructor
 * @param {string} uuid
 * @implements {crisis.Faction.ChangeListener}
 * @implements {crisis.ModelChangeListener<crisis.Faction>}
 */
crisis.FactionSelector = function(uuid) {
    /** @type {crisis.FactionSelector} */
    var thisSelector = this;

    /** @type {jQuery} */
    this.$selector = crisis.cloneProto(crisis.prototypes.$factionSelector);
    this.$selector.hide();
    /** @type {buckets.Dictionary<number, jQuery>} */
    this.options = new buckets.Dictionary();

    /**
     * @override
     * @param {crisis.Faction} faction
     */
    this.factionChanged = function(faction) {
        thisSelector.options.get(faction.id).text(faction.name);
    };

    /**
     * @override
     * @param {number} facId
     */
    this.factionDestroyed = function(facId) {
        thisSelector.options.get(facId).remove();
        thisSelector.options.remove(facId);
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
        thisSelector.$selector.remove();
        thisSelector.options.forEach(function(facId) {
            crisis.getFaction(facId).listeners.remove(thisSelector);
        });
        crisis.factionsListeners.remove(thisSelector);
    };

    /** @return {number} */
    this.getSelectedFaction = function() {
        return crisis.stringToInt(
            /** @type {string} */ (thisSelector.$selector.val()));
    };

    /** @param {number} factionId */
    this.setSelectedFaction = function(factionId) {
        thisSelector.$selector.val(factionId.toString());
    };

    crisis.factions.forEach(function(id, faction) {
        thisSelector.modelAdded(faction);
    });
    crisis.factionsListeners.add(this);
};
