/** 
 * @constructor
 * @param {crisisJson.Division} divJson
 */
crisis.Division = function(divJson) { 
    var div = this;

    /** @type{jQuery} */
    this.$marker = crisis.cloneProto(crisis.$protoDivisionMarker);
    crisis.map.$mapHolder.append(this.$marker);
    /** @type{crisis.DivisionDetails} */
    this.details = new crisis.DivisionDetails(this);
    /** @type{boolean} */
    this.reRender = true;
    /** @type{boolean} */
    this.editing = false;
    /** @type{number} */
    this.id = divJson.Id;
    /** @type{crisis.coords} */ 
    this.abscoords = null;
    /** @type{array<crisis.unit> */
    this.units = null;
    this.updateData(divJson);
     
    this.$marker.click(function() { div.details.toggle(); });
}

/** @param {crisisJson.Division} divJson */
crisis.Division.prototype.updateData = function(divJson) {
    this.absCoords = { x: divJson.AbsCoords.X, y: divJson.AbsCoords.Y };
    this.units = _.map(divJson.Units, crisis.Unit.fromData);
    this.reRender = true;
}

crisis.Division.prototype.destroy = function() {
    this.$marker.remove();
    this.details.$pane.remove();
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
    /** @type{jQuery} */
    this.$closeButton = null;
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
    crisis.map.positionDropdown(dets.$pane, dets.division.$marker);
    dets.$pane.show();
    dets.isOpen = true;
}

crisis.DivisionDetails.prototype.close = function () {
    this.$pane.hide();
    this.isOpen = false;
}

crisis.DivisionDetails.prototype.reRender = function() {
    var dets = this;

    if (dets.$pane === null) {
	      dets.$pane = crisis.cloneProto(crisis.$protoDivisionDetails);
	      dets.$unitList = dets.$pane.find("ul");
        dets.$paneInvalidAlert = dets.$pane.find(".paneInvalidAlert");

        dets.$editButton = dets.$pane.find(".editButton");
        dets.$editButton.on("click.crisis", function() {
            dets.enableEdit(); 
        });
        
        dets.$cancelButton = dets.$pane.find(".cancelButton");
        dets.$cancelButton.on("click.crisis", function () {
            dets.disableEdit();
        });
        
	      dets.$commitButton = dets.$pane.find(".commitButton");
        dets.$commitButton.on("click.crisis", function() {
            dets.commitEdit(); 
        });

        dets.$closeButton = dets.$pane.find(".closeButton");
        dets.$closeButton.on("click.crisis", function() {
            dets.close();
        });
        
        crisis.map.$mapHolder.append(dets.$pane);
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
    
    _.each(dets.division.units, function(unit) {
	      unit.$editField.val(unit.amount).show();
	      unit.$value.hide();
    });

    dets.isEditing = true;
}

crisis.DivisionDetails.prototype.disableEdit = function() {
    var dets = this;

    dets.$editButton.show();
    dets.$cancelButton.hide();
    dets.$commitButton.hide();
    
    dets.$paneInvalidAlert.hide();
    _.each(dets.division.units, function(unit) {
	      unit.$editField.hide();
	      unit.$value.show();
	      unit.$invalidAlert.hide();
    });

    dets.isEditing = false;
}

crisis.DivisionDetails.prototype.commitEdit = function() {
    var dets = this;
 
    if (!dets.isEditing) return;

    /** @type{Array<crisisJson.Unit>} */
    var newUnits = [];
    var validSubmit = true;
    _.each(dets.division.units, function(unit) {
	      var newVal = unit.$editField.val();
	      newVal = parseInt(newVal);
	      if (newVal === null) {
	          unit.$invalidAlert.show();
	          dets.$paneInvalidAlert.show();
	          validSubmit = false;
	      } else {
	          newUnits.push({TypeNum: unit.typeNum, Amount: newVal});
	      }
    });
 
    if (!validSubmit) return;
	  crisis.ajax.postDivisionUpdate(dets.division.id, newUnits);
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
    /** @type{jQuery} */
    this.$value = this.$listItem.find(".value").html(this.amount);
    /** @type{jQuery} */
    this.$type = this.$listItem.find(".type").html(crisis.cloneProto(
	      crisis.$protoUnitTypes.find("[type=" + this.typeNum + "]")));
    /** @type{jQuery} */
    this.$editField = this.$listItem.find(".editField");
    /** @type{jQuery} */
    this.$invalidAlert = this.$listItem.find(".invalidAlert");
}

/** @param {crisisJson.Unit} unitJson */
crisis.Unit.fromData = function(unitJson) {
    return new crisis.Unit(unitJson);
}
