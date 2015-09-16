/** 
 * @constructor
 * @param{crisisJson.Unit} unitJson 
 * @param{crisis.DivisionDetails} dets
 */ 
crisis.Unit = function(unitJson, dets) {
    /** @type{crisis.DivisionDetails} */
    this.details = dets;
    /** @type{number} */
    this.amount = unitJson.Amount;
    /** @type{string} */
    this.typeName = unitJson.TypeName;
    /** @type{number} */
    this.typeNum = unitJson.TypeNum;
    /** @type{jQuery} */
    this.$listItem = crisis.cloneProto(crisis.$protoUnitListItem);
    /** @type{jQuery} */
    this.$value = this.$listItem.find(".value").html(this.amount);
    /** @type{jQuery} */
    this.$type = this.$listItem.find(".type").html(crisis.Unit.typeHtml(this.typeNum));
    /** @type{jQuery} */
    this.$editField = this.$listItem.find(".editField");
    /** @type{jQuery} */
    this.$removeUnitButton = this.$listItem.find(".removeUnitButton");
    /** @type{jQuery} */
    this.$invalidAlert = this.$listItem.find(".invalidAlert");
}

crisis.Unit.prototype.editOn = function() {
    this.$editField.val(this.amount).show();
    this.$removeUnitButton.show();
    this.$value.hide();
}

crisis.Unit.prototype.editOff = function() {
    this.$editField.hide();
    this.$removeUnitButton.hide();
    this.$value.show();
}

/** @param{number} typeId */
crisis.Unit.typeHtml = function(typeId) {
    return crisis.cloneProto(
	      crisis.$protoUnitTypes.find(crisis.unitTypeSelector(typeId)));
}

/** @param{crisisJson.Unit} unitJson */
crisis.Unit.fromData = function(unitJson) {
    return new crisis.Unit(unitJson);
}
