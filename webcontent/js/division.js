/**
 * @typedef{{
 *   AbsCoords: crisis.Coords,
 *   Units: Array<crisis.UnitData>
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
    this.Data = divData;
    /** @type{crisis.DivisionDetails} */
    this.Details = new crisis.DivisionDetails(this);
    /** @type{boolean} */
    this.ReRender = true;
    /** @type{boolean} */
    this.editing = false;
    /** @type{crisis.Coords} */ 
    this.AbsCoords = divData.AbsCoords;
    
    var div = this;
    this.$marker.click(function() {
	      if (div.Details.is(":visible")) {
	          div.Details.hide();
	      } else {
	          if (div.ReRender) {
		            div.details.reRender();
		            this.ReRender = false;
	          }
	          map.positionDropdown(div.details.$pane, div.$marker);
	          div.details.$pane.show();
	      }
    });
}

/** @param {crisis.DivisionData} divData */
crisis.Division.prototype.updateData = function(divData) {
    this.Data = divData;
    this.ReRender = true;
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
    this.Division = div;
}

crisis.DivisionDetails.prototype.reRender = function() {
    var dets = this;

    if (dets.$pane === null) {
	      dets.$pane = crisis.$g_protoDivisionDetails.clone();
	      dets.$unitList = dets.$pane.find("ul");
	      dets.$editButton = dets.$pane.find(".editButton");
    }

    dets.$unitList.empty(); 
    _(dets.Division.Units).sort()
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
    // if (changedUnits.length > 0) {
	      
    // }
}

/**
 * @typedef{{
 *   Utype: string,
 *   Amount: number,
 * }} 
 */
crisis.UnitData;

/** 
 * @constructor
 * @param {crisis.UnitData} unitData 
 */ 
crisis.Unit = function(unitData) {
    /** @type{number} */
    this.Amount = unitData.Amount;
    /** @type{string} */
    this.Type = unitData.Utype;
    /** @type{jQuery} */
    this.$listItem = crisis.$g_protoUnitListItem.clone();
    this.$listItem.find(".type").html(
	      crisis.$g_protoUnitTypes.find("[type=" + this.Type + "]").clone());
    this.$listItem.find(".value").html(this.Amount);
}
