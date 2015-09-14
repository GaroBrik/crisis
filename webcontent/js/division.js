/** 
 * @constructor
 * @param {crisisJson.Division} divJson
 */
crisis.Division = function(divJson) { 
    /** @type{jQuery} */
    this.$marker = crisis.cloneProto(crisis.$protoDivisionMarker);
    crisis.$mapHolder.append(this.$marker);
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
    
    var div = this;
    this.$marker.click(function() { div.details.toggle(); });
}

/** @param {crisisJson.Division} divJson */
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
    /** @type{jQuery} */
    this.$cancelButton = null;
    /** @type{jQuery} */
    this.$commitButton = null;
    /** @type{crisis.Division} */
    this.division = div;
    /** @type{boolean} */
    this.isOpen = false;
    /** @type{boolean} */
    this.isEditing = false;
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
    crisis.map.positionDropdown(dets.$pane, dets.division.$marker);
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
	      dets.$pane = crisis.cloneProto(crisis.$protoDivisionDetails);
	      dets.$unitList = dets.$pane.find("ul");
        
	      dets.$editButton = dets.$pane.find(".editButton");
        dets.$editButton.on("click.crisis", function() {
            this.enableEdit(); 
        });
        
        dets.$cancelButton = dets.$pane.find(".cancelButton");
        dets.$cancelButton.on("click.crisis", function () {
            this.disableEdit();
        });
        
	      dets.$commitButton = dets.$pane.find(".commitButton");
        dets.$commitButton.on("click.crisis", function() {
            this.commitEdit(); 
        });
        
        crisis.$mapHolder.append(dets.$pane);
    }

    dets.$unitList.empty(); 
    _.each(dets.division.units, function(unit) { 
        dets.$unitList.append(unit.$listItem); 
    });	
}

crisis.DivisionDetails.prototype.toggleEdit = function() {
    if (this.isEditing) {
        this.disableEdit();
    } else {
        this.enableEdit();
    }
}

crisis.DivisionDetails.prototype.enableEdit = function() {
    var dets = this; 

    dets.$editButton.hide();
    dets.$cancelButton.show();
    dets.$commitButton.show();
    
    _.each(units, function(unit) {
	      unit.$listItem.find(".editField").val(unit.amount).show();
	      unit.$listItem.find(".value").hide();
    });
}

crisis.DivisionDetails.prototype.disableEdit = function() {
    var dets = this;

    dets.$editButton.show();
    dets.$cancelButton.hide();
    dets.$commitButton.hide();
    
    dets.find(".paneInvalidAlert").hide();
    _.each(units, function(unit) {
	      unit.$listItem.find(".editField").hide();
	      unit.$listItem.find(".value").show();
	      unit.$listItem.find(".invalidAlert").hide();
    });
}

crisis.DivisionDetails.prototype.commitEdit = function() {
    var dets = this;

    if (!dets.isEditing) return;

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

    this.$listItem.find(".type").html(crisis.cloneProto(
	      crisis.$protoUnitTypes.find("[type=" + this.typeNum + "]")));
    this.$listItem.find(".value").html(this.amount);
}

/** @param {crisisJson.Unit} unitJson */
crisis.Unit.fromData = function(unitJson) {
    return new crisis.Unit(unitJson);
}
