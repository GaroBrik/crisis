/**
 * @constructor
 * @param {string} uuid
 * @param {function(number)} callback
 * @param {Array<number>} notInclude
 * @implements {crisis.UnitType.ChangeListener}
 * @implements {crisis.ModelChangeListener<crisis.UnitType>}
 */
crisis.UnitTypeChooser = function(uuid, callback, notInclude) {
    /** @type {crisis.UnitTypeChooser} */
    var thisChooser = this;

    /** @type {jQuery} */
    this.$chooser = crisis.cloneProto(crisis.prototypes.$unitTypeChooser);
    /** @type {buckets.Dictionary<number, jQuery>} */
    this.choices = new buckets.Dictionary();

    /** @param {number} num */
    var thisCallback = function(num) {
        thisChooser.destroy();
        callback(num);
    };

    /**
     * @override
     * @param {crisis.UnitType} unitType
     */
    this.unitTypeChanged = function(unitType) {
        thisChooser.choices.get(unitType.id).text(unitType.name);
    };

    /**
     * @override
     * @param {number} typeId
     */
    this.factionDestroyed = function(typeId) {
        thisChooser.choices.get(typeId).remove();
        thisChooser.choices.remove(typeId);
    };

    /**
     * @override
     * @param {crisis.UnitType} unitType
     */
    this.modelAdded = function(unitType) {
        /** @type {jQuery} */
        var newChoice = $('<li/>').append(
            crisis.prototypes.typeChooserButton(unitType, thisCallback));
        thisChooser.choices.set(unitType.id, newChoice);
        unitType.listeners.add(thisChooser);
        thisChooser.$chooser.append(newChoice);
    };

    if (uuid === undefined) {
        uuid = 'unitTypeChooser(' + (new Date).getTime() + ')';
    }
    /**
     * @override
     * @return {string}
     */
    this.listenerId = function() {
        return uuid;
    };

    this.destroy = function() {
        thisChooser.$chooser.remove();
        thisChooser.choices.forEach(function(typeId) {
            crisis.getUnitType(typeId).listeners.remove(thisChooser);
        });
        crisis.unitTypesListeners.remove(thisChooser);
    };

    crisis.unitTypes.forEach(function(id, unitType) {
        if (_.contains(notInclude, id)) return;
        thisChooser.modelAdded(unitType);
    });
    crisis.unitTypesListeners.add(this);
};
