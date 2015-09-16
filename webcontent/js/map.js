/** @enum{string} */
crisis.MapState = Object.freeze({
    NORMAL: "NORMAL",
    ADDING_DIV: "ADDING_DIV"
});

/** @export */
crisis.map = {
    /** @type{Array<crisis.Division>} */
    divisions: null,
    /** @type{crisis.Coords} */
    loc: null,
    /** @type{crisis.Bounds} */
    bounds: null,
    /** @type{crisis.Bounds} */
    maxBounds: null,
    /** @type{crisis.MapState} */
    state: crisis.MapState.NORMAL,
    /** @type{jQuery} */
    $mapHolder: null
};

/** 
 * @export
 * @param {crisisJson.Crisis} 
 */
crisis.map.init = function(crisisData) { 
    crisis.map.$mapHolder = $("#mapHolder");
    
    $(window).on("crisis.resize", function() {
        crisis.map.positionDivisions();
    });

    crisis.ajax.pollNow(crisis.ajax.mapPath, {
        success: function(data) {
            crisis.map.updateData(data);
        }
    });
}

crisis.map.updateData = function(crisisData) {
    /** @type{Array<crisis.Division>} */
    var removedDivisions = [];
    _.each(crisis.map.divisions, function(div) {
        var updated = _.findWhere(crisisData.Divisions, {Id: div.id});
        if (updated === undefined) {
            div.destroy();
            removedDivisions.push(div);
        } else {
            div.updateData(updated);
        }
        crisisData.Divisions = _.without(crisisData.Divisions, updated);
    });

    _.each(removedDivisions, function(removedDivision) {
        crisis.map.divisions = _.without(crisis.map.divisions, removedDivision);
    });

    _.each(crisisData.Divisions, function(divJson) {
        crisis.map.divisions.push(new crisis.Division(divJson));
    });

    crisis.map.loc = {
	      x: 0,
	      y: 0
    }
    crisis.map.bounds = { height: crisisData.MapBounds.Height, width: crisisData.MapBounds.Width };
    crisis.map.maxBounds = { height: crisisData.MapBounds.Height, width: crisisData.MapBounds.Width };
    
    crisis.map.positionDivisions();
}

/**
 * @param {jQuery} $dropdown
 * @param {jQuery} $source
 */ 
crisis.map.positionDropdown = function($dropdown, $source) {
    var canvasTop = 0;
    var canvasLeft = 0;
    var canvasBottom = $(window).height();
    var canvasRight = $(window).width();
    var idealY = $source.position().top + $source.height() / 2;
    if (idealY + $dropdown.size() > canvasBottom) {
	      idealY += canvasBottom - (idealY + $dropdown.size());
    }

    if (idealY < canvasTop) {
	      idealY += canvasTop - idealY;
    }

    var idealX = $source.position().left + $source.width() / 2;
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

/** 
 * @param {crisis.Coords} absCoords 
 * @return {crisis.Coords}
 */
crisis.map.relativeCoords = function(absCoords) {
    var map = crisis.map;
    return {
	      x: (absCoords.x - map.loc.x) * 100 / map.bounds.width,
	      y: (absCoords.y - map.loc.y) * 100 / map.bounds.height
    }
}

/**
 * @param {crisis.Coords}
 * @return {crisis.Coords}
 */
crisis.map.absCoords = function(relativeCoords) {
    return {
	      x: map.bounds.width * relativeCoords.x / 100 + map.loc.x,
	      y: map.bounds.height * relativeCoords.y / 100 + map.loc.y	
    }
}

/**
 * @param {number} factor
 * @param {number} center
 */ 
crisis.map.zoom = function(factor, center) {
    var map = crisis.map;
    
    var newBounds = {
	      height: Math.min(map.bounds.height * factor, map.maxBounds.height),
	      width: Math.min(map.bounds.width * factor, map.maxBounds.width)
    }
    var newLoc = {
	      x: Math.max(0, Math.min(map.maxBounds.width - newBounds.width,
				                        center - newBounds.width)),
	      y: Math.max(0, Math.min(map.maxBounds.height - newBounds.height,
				                        center - newBounds.height))
    }
    map.bounds = newBounds;
    map.loc = newLoc;
    map.positionDivisions();
}

/**
 * @param {number} xPercent
 * @param {number} yPercent
 */
crisis.map.move = function(xPercent, yPercent) {
    var map = crisis.map;
    map.loc = {
	      x: Math.max(0, Math.min(map.maxBounds.width - newBounds.width,
				                        map.loc.x - xPercent * map.bounds.Width)),
	      y: Math.max(0, Math.min(map.maxBounds.height - newBounds.height,
				                        map.loc.y - yPercent * map.bounds.height))
    }
    map.positionDivisions();
}

/** @param{crisis.Division} division */
crisis.map.positionDivision = function(division) {
    var map = crisis.map;
    
	  var rel = map.relativeCoords(division.absCoords);
	  if (0 <= rel.x && rel.x <= 100 && 0 <= rel.y && rel.y <= 100) {
	      division.$marker.css({
		        "left": rel.x + "%",
		        "top": rel.y + "%"
	      });
	      division.$marker.show();
	      if (division.details.isOpen) {
		        map.positionDropdown(division.details.$pane, division.$marker);
		        division.details.$pane.show();
	      }
    } else {
        division.$marker.hide();
        division.details.$pane.hide();
    }
}

crisis.map.positionDivisions = function() {
    _.each(crisis.map.divisions, crisis.map.positionDivision);
}

/** 
 * @param{Array<number>} notInclude 
 * @param{jQuery} $positionIn
 * @param{function(number)} callback
 * @return{function()} a function which cancels this process
 */
crisis.map.showUnitTypeFinder = function(notInclude, $positionIn, callback) {
    var $thisFinder = crisis.cloneProto(crisis.$protoUnitTypeFinder);

    _.each(notInclude, function(num) {
        $thisFinder.children(crisis.unitTypeSelector(num)).remove();
    });

    /** @type{function()} */
    var cancel;
    
    $thisFinder.children().on("click.crisis", function() {
        callback($(this).data("type"));
        cancel();
    });

    var $children = $positionIn.children();

    cancel = function() {
        $thisFinder.remove();
        $positionIn.append($children);
    }

    $children.detach();
    $positionIn.append($thisFinder);

    return cancel;
}
