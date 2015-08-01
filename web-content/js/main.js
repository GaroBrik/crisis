crisis = {
    $g_protoDivisionMarker: null,
    $g_protoDivisionDetails: null

    init = function() {
	this.$g_protoDivisionMarker = $("#protoDivisionMarker");
	this.$g_protoDivisionDetails = $("#protoDivisionDetails");
    }
}

crisis.Map = new function(data) {
    this.data = data;
    this.divisions = _.map(data.divisions, new function(div) {
	return crisis.Division
    });
    this.loc = {
	x: 0,
	y: 0
    }
    this.bounds = {
	height: data.mapHeight,
	width:  data.mapWidth
    };
    this.maxBounds = {
	height: data.mapHeight,
	width:  data.mapWidth
    };
}

crisis.Map.prototype.positionDropdown = new function($dropdown, $source) {
    var canvasTop = 0;
    var canvasLeft = 0;
    var canvasBottom = window.height();
    var canvasRight = window.width();
    var idealY = $source.top() + $source.height() / 2;
    if (idealY + $dropdown.size() > canvasBottom) {
	idealY += canvasBottom - (idealY + $dropdown.size());
    }

    if (idealY < canvasTop) {
	idealY += canvasTop - idealY;
    }

    var idealX = $source.left() + $source.width() / 2;
    if (idealX + $dropdown.width() > canvasRight) {
	idealX += canvasRight - (idealX + $dropdown.width());
    }

    if (idealX < canvasLeft) {
	idealX += canvasLeft - idealX;
    }

    $dropdown.css({
	"left": idealX,
	"top": idealY
    });
}

crisis.Map.prototype.relativeCoords = new function(absCoords) {
    return {
	x: (absCoords.x - map.loc.x) / map.bounds.width,
	y: (absCoords.y - map.loc.y) / map.bounds.height
    }
}

crisis.Map.prototype.absCoords = new function(relativeCoords) {
    return {
	x: map.bounds.width * relativeCoords.x + map.loc.x,
	y: map.bounds.height * relativeCoords.y + map.loc.y	
    }
}

crisis.Map.prototype.zoom = new function(factor, center) {
    var map = this;
    
    var newBounds = {
	height: Math.min(map.bounds.height * factor, map.maxBounds.height),
	width: Math.min(map.bounds.width * factor, map.maxBounds.width)
    }
    var newCenter = {
	x: Math.max(0, Math.min(map.maxBounds.width - newBounds.width,
				center - newBounds.width)),
	y: Math.max(0, Math.min(map.maxBounds.height - newBounds.height,
				center - newBounds.height))
    }
    map.bounds = newBounds;
    map.loc = loc;
    map.positionDivisions();
}

crisis.Map.prototype.move = new function(xPercent, yPercent) {
    var map = this;
    map.loc = {
	x: Math.max(0, Math.min(map.maxBounds.width - newBounds.width,
				map.loc.x - xPercent * map.bounds.width)),
	y: Math.max(0, Math.min(map.maxBounds.height - newBounds.height,
				map.loc.y - yPercent * map.bounds.height)),	
    }
    map.positionDivisions();
}

crisis.Map.prototype.positionDivisions = new function() {
    var map = this;

    _.each(map.divisions(), function(div) {
	var rel = map.relativeCoords(div.absCoords);
	if (0 <= rel.x && rel.x <= 100 && 0 <= rel.y && rel.y <= 100) {
	    div.$marker.css({
		"left": rel.x + "%",
		"top": rel.y + "%"
	    });
	    div.$marker.show();
	    if (div.$detailsPane.is(":visible")) {
		map.positionDropdown(div.$detailsPane, div.$marker);
		div.$detailsPane.show();
	    }
	} else {
	    div.$marker.hide();
	    div.$detailsPane.hide();
	}
    });
}	
    
crisis.Division = new function(data, map) {
    this.$marker = crisis.$g_protoDivisionMarker.clone();
    this.data = data;
    this.detailsPane = new DivisionDetails();
    this.reRender = true;
    this.editing = false;
    this.absCoords = data.absCoords;

    this.$marker.click(new function() {
	if (div.$detailsPane.is(":visible")) {
	    div.$detailsPane.hide();
	} else {
	    if (div.reRender) {
		div.details.reRender(div.data.units);
		_(div.data.units).sort()
		    .map(renderUnitCell)
		    .each(new function() { div.$unitList.append(this);});
		this.reRender = false;
	    }
	    map.positionDropdown(div.details.$pane, div.$marker);
	    div.details.$pane.show();
	}
    });

    this.$detailsPane.find(".editButton").click(function() {
	if () {}
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
	.each(new function(unit) { dets.$unitList.append(unit.$listItem);});	
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

crisis.Unit = new function(data) {
    this.amount = data.amount;
    this.type = data.type;
    this.$listItem = crisis.$g_protoUnitListItem.clone();
    this.$listItem.find(".type").html(
	crisis.$g_protoUnitTypes.find("[type=" + this.type).clone());
    this.$listItem.find(".value").html(this.amount);
}
