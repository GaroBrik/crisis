/**
 * @typedef{{
 *   absCoords: crisis.Coords,
 *   units: Array<crisis.UnitData>
 * }}
 */
crisis.DivisionData;

/** 
 * @constructor
 * @param {crisis.DivisionData} divData
 */
crisis.Division = function(divData) { 
    /** @type{jQuery} */
    this.$marker = crisis.$g_protoDivisionMarker.clone();
    /** @type{crisis.DivisionData} */
    this.data = divData;
    /** @type{crisis.DivisionDetails} */
    this.detailsPane = new crisis.DivisionDetails();
    /** @type{boolean} */
    this.reRender = true;
    /** @type{boolean} */
    this.editing = false;
    /** @type{crisis.Coords} */ 
    this.absCoords = divData.absCoords;

    this.$marker.click(function() {
	      if (div.$detailsPane.is(":visible")) {
	          div.$detailsPane.hide();
	      } else {
	          if (div.reRender) {
		            div.details.reRender(div.data.units);
		            this.reRender = false;
	          }
	          map.positionDropdown(div.details.$pane, div.$marker);
	          div.details.$pane.show();
	      }
    });
}

/** @param {crisis.DivisionData} divData */
crisis.Division.prototype.updateData = function(divData) {
    this.data = divData;
    this.reRender = true;
}

/** @constructor */
crisis.DivisionDetails = function() {
    /** @type{jQuery} */
    this.$pane = null;
    /** @type{jQuery} */
    this.$unitList = null;
    /** @type{jQuery} */
    this.$editButton = null;
}

/** @param {crisis.DivisionData} divData */
crisis.DivisionDetails.prototype.reRender = function(divData) {
    var dets = this;

    if (dets.$pane === null) {
	      dets.$pane = crisis.$g_protoDivisionDetails.clone();
	      dets.$unitList = dets.$pane.find("ul");
	      dets.$editButton = dets.$pane.find(".editButton");
    }

    dets.$unitList.empty(); 
    _(divData.units).sort()
	      .map(crisis.Unit)
	      .each(function(unit) { dets.$unitList.append(unit.$listItem); });	
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
    if (changedUnits.length > 0) {
	      
    }
}

/**
 * @typedef{{
 *   type: string,
 *   amount: number,
 *   $listItem: jQuery
 * }} 
 */
crisis.UnitData;

/** 
 * @constructor
 * @param {crisis.UnitData} unitData 
 */ 
crisis.Unit = function(unitData) {
    this.amount = unitData.amount;
    this.type = unitData.type;
    this.$listItem = crisis.$g_protoUnitListItem.clone();
    this.$listItem.find(".type").html(
	      crisis.$g_protoUnitTypes.find("[type=" + this.type + "]").clone());
    this.$listItem.find(".value").html(this.amount);
}
