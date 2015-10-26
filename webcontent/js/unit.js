/**
 * @constructor
 * @param {crisisJson.Unit} unitJson
 * @param {crisis.Division} div
 * @implements {crisis.Updateable<crisisJson.Unit>}
 * @implements {crisis.UnitType.ChangeListener}
 */
crisis.Unit = function(unitJson, div) {
    /** @type {crisis.Unit} */
    var thisUnit = this;

    /** @type {crisis.Division} */
    this.division = div;
    /** @type {number} */
    this.amount = unitJson.Amount;
    /** @type {number} */
    this.type = unitJson.Type;
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

    this.$type.text(crisis.getUnitType(this.type).name);
    crisis.unitTypes.get(this.type).listeners.add(this);
    this.$removeUnitButton.on('click' + crisis.event.baseNameSpace, function() {
        thisUnit.division.details.removeUnit(thisUnit);
    });
    this.$value.text(this.amount);
};

/** @inheritDoc */
crisis.Unit.prototype.update = function(data) {
    this.amount = data.Amount;
    this.$value.text(this.amount);
};

crisis.Unit.prototype.destroy = function() {
    this.$listItem.remove();
    this.division.removeUnit(this);
    crisis.unitTypes.get(this.type).listeners.remove(this);
};

crisis.Unit.prototype.enableEdit = function() {
    this.$editField.val(this.amount.toString()).show();
    this.$removeUnitButton.show();
    this.$value.hide();
};

crisis.Unit.prototype.disableEdit = function() {
    this.$editField.hide();
    this.$removeUnitButton.hide();
    this.$value.show();
};

/** @param {crisis.UnitType} unitType */
crisis.Unit.prototype.unitTypeChanged = function(unitType) {
    this.$type.text(unitType.name);
};

crisis.Unit.prototype.listenerId = function() {
    return 'division(' + this.division.id + ')';
};
