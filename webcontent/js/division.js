/**
 * @typedef{{
 * units: Array<crisis.UnitData>
 * absCoords: crisis.Coords
 * }} 
 */
crisis.DivisionData;

crisis.Division = new function(divData) {
    console.log("test");
    this.$marker = crisis.$g_protoDivisionMarker.clone();
    this.data = divData;
    this.detailsPane = new DivisionDetails();
    this.reRender = true;
    this.editing = false;
    this.absCoords = divData.absCoords;

    this.$marker.click(new function() {
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

    this.$detailsPane.find(".editButton").click(function() {
	      //if () {}
    });
}

crisis.Division.prototype.updateData = new function(data) {
    this.data = data;
    this.reRender = true;
}

crisis.DivisionDetails = new function() {
    this.$pane = null;
    this.$unitList = null;
    this.$editButton = null;
}

crisis.DivisionDetails.prototype.reRender = new function(units) {
    var dets = this;

    if (dets.$pane === null) {
	      dets.$pane = crisis.$g_protoDivisionDetails.clone();
	      dets.$unitList = dets.$pane.find("ul");
	      dets.$editButton = dets.$pane.find(".editButton");
    }

    dets.$unitList.empty(); 
    _(units).sort()
	      .map(crisis.Unit)
	      .each(new function(unit) { dets.$unitList.append(unit.$listItem); });	
}

crisis.DivisionDetails.prototype.enableEdit = new function() {
    var dets = this;
    
    _.each(units, new function() {
	      var unit = this;
	      
	      unit.$listItem.find(".editField").val(unit.amount).show();
	      unit.$listItem.find(".value").hide();
    });
}

crisis.DivisionDetails.prototype.disableEdit = new function() {
    var dets = this;

    dets.find(".paneInvalidAlert").hide();
    _.each(units, new function(unit) {
	      unit.$listItem.find(".editField").hide();
	      unit.$listItem.find(".value").show();
	      unit.$listItem.find(".invalidAlert").hide();
    });
}

crisis.DivisionDetails.prototype.commitEdit = new function() {
    var dets = this;

    var changedUnits = [];
    var validSubmit = true;
    _.each(dets.units, new function(unit) {
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
 * type: string,
 * amount: number,
 * $listItem: jQuery
 * }} 
 */
crisis.UnitData;

crisis.Unit = new function(data) {
    this.amount = data.amount;
    this.type = data.type;
    this.$listItem = crisis.$g_protoUnitListItem.clone();
    this.$listItem.find(".type").html(
	      crisis.$g_protoUnitTypes.find("[type=" + this.type + "]").clone());
    this.$listItem.find(".value").html(this.amount);
}
