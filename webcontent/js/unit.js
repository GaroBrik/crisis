/** 
 * @constructor
 * @param {crisisJson.Unit} unitJson 
 */ 
crisis.Unit = function(unitJson) {
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
    this.$invalidAlert = this.$listItem.find(".invalidAlert");
}

/** @param{number} typeId */
crisis.Unit.typeHtml = function(typeId) {
    return crisis.cloneProto(
	      crisis.$protoUnitTypes.find("[data-type=" + typeId + "]"));
}

/** @param{crisisJson.Unit} unitJson */
crisis.Unit.fromData = function(unitJson) {
    return new crisis.Unit(unitJson);
}
