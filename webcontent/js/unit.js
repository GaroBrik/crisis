/**
 * @constructor
 * @param {crisisJson.Unit} unitJson
 * @param {crisis.Division} div
 * @implements {crisis.Updateable<crisisJson.Unit>}
 */
crisis.Unit = function(unitJson, div) {
    var unit = this;

    /** @type {crisis.Division} */
    unit.division = div;
    /** @type {number} */
    unit.amount = unitJson.Amount;
    /** @type {number} */
    unit.type = unitJson.Type;
    /** @type {jQuery} */
    unit.$listItem = crisis.cloneProto(crisis.$protoUnitListItem);
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

    unit.$type.append(crisis.Unit.typeHtml(unit.type));
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

/** @inheritDoc */
crisis.Unit.prototype.updateDataMatch = function(data) {
    return this.type === data.Type;
};

crisis.Unit.prototype.destroy = function() {
    this.$listItem.remove();
    this.division.removeUnit(this);
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

/**
 * @param {number} typeId
 * @return {jQuery}
*/
crisis.Unit.typeHtml = function(typeId) {
    return crisis.cloneProto(
        crisis.$protoUnitTypes.find(crisis.dataSelector(typeId, 'type')));
}
