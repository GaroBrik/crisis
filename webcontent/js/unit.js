/**
 * @constructor
 * @param {crisisJson.Unit} unitJson
 * @param {crisis.Division} div
 * @implements {crisis.Updateable<crisisJson.Unit>}
 * @implements {crisis.UnitType.ChangeListener}
 */
crisis.Unit = function(unitJson, div) {
    /** @type {crisis.Unit} */
    var unit = this;

    /** @type {crisis.Division} */
    unit.division = div;
    /** @type {number} */
    unit.amount = unitJson.Amount;
    /** @type {number} */
    unit.type = unitJson.Type;
    /** @type {jQuery} */
    unit.$listItem = crisis.cloneProto(crisis.prototypes.$unitListItem);
    /** @type {jQuery} */
    unit.$value = unit.$listItem.find('.value');
    /** @type {jQuery} */
    unit.$type = unit.$listItem.find('.type');
    /** @type {jQuery} */
    unit.$editField = unit.$listItem.find('.editField');
    /** @type {jQuery} */
    unit.$removeUnitButton = unit.$listItem.find('.removeUnitButton');
    /** @type {jQuery} */
    unit.$invalidAlert = unit.$listItem.find('.invalidAlert');

    unit.$type.text(crisis.unitTypes.get(unit.type).name);
    crisis.unitTypes.get(unit.type).listeners.add(this);
    unit.$removeUnitButton.on('click' + crisis.event.baseNameSpace, function() {
        unit.division.details.removeUnit(unit);
    });
    unit.$value.text(unit.amount);
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
    this.$editField.val(this.amount).show();
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
