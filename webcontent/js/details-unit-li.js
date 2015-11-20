/**
 * @constructor
 * @param {boolean} forCreation
 * @param {crisis.DivisionDetails} details
 * @param {number} typeId
 * @param {number} amount
 * @implements {crisis.UnitType.ChangeListener}
 * @implements {crisis.Unit.ChangeListener}
 */
crisis.DetailsUnitLi = function(forCreation, details, typeId, amount) {
    /** @type {crisis.DetailsUnitLi} */
    var thisLi = this;

    /** @type {boolean} */
    this.forCreation = forCreation;
    /** @type {number} */
    this.typeId = typeId;
    /** @type {jQuery} */
    this.$listItem = crisis.cloneProto(crisis.prototypes.$unitListItem);
    /** @type {jQuery} */
    this.$icon = this.$listItem.find('.icon');
    /** @type {jQuery} */
    this.$value = this.$listItem.find('.value');
    /** @type {jQuery} */
    this.$type = this.$listItem.find('.type');
    /** @type {jQuery} */
    this.$editField = this.$listItem.find('.editField');
    /** @type {jQuery} */
    this.$removeUnitButton = this.$listItem.find('.removeUnitButton');
    /** @type {jQuery} */
    this.$invalidAlert = this.$listItem.find('.invalidAlert');

    /**
     * @override
     * @param {crisis.UnitType} unitType
     */
    this.unitTypeChanged = function(unitType) {
        thisLi.$type.text(unitType.name);
    };

    /**
     * @override
     * @param {crisis.Unit} unit
     */
    this.unitChanged = function(unit) {
        thisLi.$value.text(unit.amount);
    };

    /** @override */
    this.unitTypeDestroyed = function() { thisLi.destroy(); };

    /** @override */
    this.unitDestroyed = function() { thisLi.destroy(); };

    /** @type {number} */
    var uuid = (new Date).getTime();
    /**
     * @override
     * @return {string}
     */
    this.listenerId = function() {
        return 'detailsUnitLi(' + uuid + ')';
    };

    this.enableEdit = function() {
        thisLi.$editField.val(/** @type {string} */ (thisLi.$value.text()));
        thisLi.$value.hide();
        thisLi.$editField.show();
        thisLi.$removeUnitButton.show();
    };

    this.disableEdit = function() {
        if (thisLi.forCreation) {
            thisLi.destroy();
        } else {
            thisLi.$editField.hide();
            thisLi.$removeUnitButton.hide();
            thisLi.$value.show();
            thisLi.$invalidAlert.hide();
        }
    };

    this.destroy = function() { thisLi.$listItem.remove(); };

    this.$icon.attr('src', 'bgs/t1-' + typeId + '.png?' + (new Date).getTime());
    this.$type.text(crisis.getUnitType(typeId).name);
    crisis.getUnitType(typeId).listeners.add(this);
    this.$removeUnitButton.on('click' + crisis.event.baseNameSpace, function() {
        details.removeUnitLi(thisLi);
    });
    this.$value.text(amount);
    if (!details.uninitialized) {
        details.$unitList.append(this.$listItem);
    }
    if (this.forCreation) this.enableEdit();
};

/**
 * @param {crisis.Unit} unit
 * @return {crisis.DetailsUnitLi}
 */
crisis.DetailsUnitLi.fromUnit = function(unit) {
    return new crisis.DetailsUnitLi(
        false, unit.division.details, unit.type, unit.amount);
};

/**
 * @param {crisis.DivisionDetails} details
 * @param {number} typeId
 * @return {crisis.DetailsUnitLi}
 */
crisis.DetailsUnitLi.forCreation = function(details, typeId) {
    return new crisis.DetailsUnitLi(true, details, typeId, 0);
};
