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
    var thisUnitLi = this;
    
    /** @type {boolean} */
    this.forCreation = forCreation;
    /** @type {number} */
    this.typeId = typeId;
    /** @type {jQuery} */
    this.$listItem = crisis.cloneProto(crisis.prototypes.$unitListItem);
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

    this.$type.text(crisis.getUnitType(typeId).name);
    crisis.getUnitType(typeId).listeners.add(this);
    this.$removeUnitButton.on('click' + crisis.event.baseNameSpace, function() {
        details.removeUnitLi(thisUnitLi);
    });
    this.$value.text(amount);

    /**
     * @override
     * @param {crisis.UnitType} unitType
     */
    this.unitTypeChanged = function(unitType) {
        this.$type.text(unitType.name);
    };

    /**
     * @override
     * @param {crisis.Unit} unit
     */
    this.unitChanged = function(unit) {
        this.$value.text(unit.amount);
    };

    /** @override */
    this.unitTypeDestroyed = function() { this.destroy(); };

    /** @override */
    this.unitDestroyed = function() { this.destroy(); };

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
        this.$editField.val(/** @type {string} */(this.$value.val()));
        this.$value.hide();
        this.$editField.show();
        this.$removeUnitButton.show();
    };

    this.disableEdit = function() {
        if (this.forCreation) {
            this.destroy();
        } else {
            this.$editField.hide();
            this.$removeUnitButton.hide();
            this.$value.show();
        }
    };

    this.destroy = function() { this.$listItem.remove(); };

    details.$unitList.append(this.$listItem);
    if (this.forCreation) this.enableEdit();
};

/** @param {crisis.Unit} unit */
crisis.DetailsUnitLi.fromUnit = function(unit) {
    return new crisis.DetailsUnitLi(
        false, unit.division.details, unit.type, unit.amount);
};

/**
 * @param {crisis.DivisionDetails} details
 * @param {number} typeId
 */
crisis.DetailsUnitLi.forCreation = function(details, typeId) {
    return new crisis.DetailsUnitLi(true, details, typeId, 0);
};
