/** 
 * @constructor
 * @param {crisis.DivisionJson} divJson
 */
crisis.Division = function(divJson, map) { 
    /** @type{jQuery} */
    this.$marker = crisis.$g_protoDivisionMarker.clone();
    crisis.$g_mapHolder.append(this.$marker);
    /** @type{crisis.DivisionDetails} */
    this.details = new crisis.DivisionDetails(this);
    /** @type{boolean} */
    this.reRender = true;
    /** @type{boolean} */
    this.editing = false;
    /** @type{crisis.Coords} */ 
    this.absCoords = { x: divJson.AbsCoords.X, y: divJson.AbsCoords.Y };
    /** @type{Array<crisis.Unit> */
    this.units = _.map(divJson.Units, crisis.Unit.fromData);
    /** @type{crisis.Map} */
    this.map = map;
    
    var div = this;
    this.$marker.click(function() { div.details.toggle(); });
}

/** @param {crisis.DivisionJson} divJson */
crisis.Division.prototype.updateData = function(divJson) {
    this.absCoords = divJson.AbsCoords;
    this.units = _.map(divJson.Units, crisis.Unit.fromData);
    this.reRender = true;
}

/** 
 * @constructor
 * @param {crisis.Division} div
 */
crisis.DivisionDetails = function(div) {
    /** @type{jQuery} */
    this.$pane = null;
    /** @type{jQuery} */
    this.$unitList = null;
    /** @type{jQuery} */
    this.$editButton = null;
    /** @type{crisis.Division} */
    this.division = div;
    /** @type{boolean} */
    this.isOpen = false;
}

crisis.DivisionDetails.prototype.toggle = function() {
	  if (this.isOpen) {
        this.close();
    } else {
        this.open();
    }
};

crisis.DivisionDetails.prototype.open = function() {
    var dets = this;

    if (dets.division.reRender) {
        dets.reRender();
        dets.division.reRender = false;
    }
    console.log(dets.$pane);
    dets.division.map.positionDropdown(dets.$pane, dets.division.$marker);
    dets.$pane.show();
    dets.isOpen = true;
}

crisis.DivisionDetails.prototype.close = function () {
    this.$pane.show();
    this.isOpen = false;
}

crisis.DivisionDetails.prototype.reRender = function() {
    var dets = this;

    if (dets.$pane === null) {
	      dets.$pane = crisis.$g_protoDivisionDetails.clone();
	      dets.$unitList = dets.$pane.find("ul");
	      dets.$editButton = dets.$pane.find(".editButton");
        crisis.$g_mapHolder.append(dets.$pane);
    }

    dets.$unitList.empty(); 
    _.each(dets.division.units, function(unit) { 
        dets.$unitList.append(unit.$listItem); 
    });	
}

crisis.DivisionDetails.prototype.enableEdit = function() {
    var dets = this;
    
    _.each(units, function() {
	      var unit = this;
	      
	      unit.$listItem.find(".editField").val(unit.amount).show();
	      unit.$listItem.find(".value").hide();
    });
}

crisis.DivisionDetails.prototype.disableEdit = function() {
    var dets = this;

    dets.find(".paneInvalidAlert").hide();
    _.each(units, function(unit) {
	      unit.$listItem.find(".editField").hide();
	      unit.$listItem.find(".value").show();
	      unit.$listItem.find(".invalidAlert").hide();
    });
}

crisis.DivisionDetails.prototype.commitEdit = function() {
    var dets = this;

    var changedUnits = [];
    var validSubmit = true;
    _.each(dets.units, function(unit) {
	      var newVal = unit.$listItem.find(".editField").val();
	      newVal = parseInt(newVal);
	      if (newVal === null) {
	          unit.$listItem.find(".invalidAlert").show();
	          dets.$pane.find(".paneInvalidAlert").show();
	          validSubmit = false;
	      } else {
	          changedUnits.append(unit.type, newVal);
	      }
    });

    if (!validSubmit) return;
    // if (changedUnits.length > 0) {
	      
    // }
}

/** 
 * @constructor
 * @param {crisis.UnitJson} unitJson 
 */ 
crisis.Unit = function(unitJson) {
    /** @type{number} */
    this.amount = unitJson.Amount;
    /** @type{string} */
    this.type = unitJson.Utype;
    /** @type{jQuery} */
    this.$listItem = crisis.$g_protoUnitListItem.clone();
    this.$listItem.find(".type").html(
	      crisis.$g_protoUnitTypes.find("[type=" + this.type + "]").clone());
    this.$listItem.find(".value").html(this.amount);
}

/** @param {crisis.UnitJson} unitJson */
crisis.Unit.fromData = function(unitJson) {
    return new crisis.Unit(unitJson);
}
