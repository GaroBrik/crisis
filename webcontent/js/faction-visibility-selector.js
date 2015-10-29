/**
 * @constructor
 * @param {string} uuid
 * @param {buckets.Set<number>} alreadySelected
 * @implements {crisis.Faction.ChangeListener}
 * @implements {crisis.ModelChangeListener<crisis.Faction>}
 */
crisis.FactionVisibilitySelector = function(uuid, alreadySelected) {
    /** @type {crisis.FactionVisibilitySelector} */
    var thisSelector = this;

    this.$selector = $('<ul/>').addClass('factionVisibilitySelector');
    /** @type {buckets.Dictionary<number, jQuery>} */
    this.selections = new buckets.Dictionary();

    /**
     * @override
     * @param {crisis.Faction} faction
     */
    this.factionChanged = function(faction) {
        thisSelector.selections.get(faction.id)
            .find('label').text(faction.name);
    };

    /**
     * @override
     * @param {number} facId
     */
    this.factionDestroyed = function(facId) {
        thisSelector.selections.get(facId).remove();
        thisSelector.selections.remove(facId);
    };

    /**
     * @override
     * @param {crisis.Faction} fac
     */
    this.modelAdded = function(fac) {
        var newSelection = $('<li/>');
        newSelection.append(/** @type {jQuery} */ (
            $('<input/>').prop('type', 'checkbox').val(fac.id.toString())));
        newSelection.append($('<label/>').text(fac.name));

        thisSelector.selections.set(fac.id, newSelection);
        fac.listeners.add(thisSelector);
        thisSelector.$selector.append(newSelection);
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
        thisSelector.selections.forEach(function(facId) {
            crisis.getFaction(facId).listeners.remove(thisSelector);
        });
        crisis.factionsListeners.remove(thisSelector);
    };

    /** @return {Array<number>} */
    this.getSelectedFactions = function() {
        /** @type {Array<number>} */
        var result = [];
        thisSelector.selections.forEach(function(id, selection) {
            if (selection.find('input').prop('checked')) {
                result.push(id);
            }
        });
        return result;
    };

    crisis.factions.forEach(function(id, faction) {
        thisSelector.modelAdded(faction);
        if (alreadySelected.contains(id)) {
            thisSelector.selections.get(id).find('input').prop('checked', true);
        }
    });
    crisis.factionsListeners.add(this);
};
