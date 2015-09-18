/** @enum{string} */
crisis.MapState = Object.freeze({
    NORMAL: "NORMAL",
    ADDING_DIV: "ADDING_DIV"
});

/** @export */
crisis.map = {
    /** @type{Array<crisis.Division>} */
    divisions: [],
    /** @type{crisis.Coords} */
    loc: null,
    /** @type{crisis.Bounds} */
    bounds: null,
    /** @type{crisis.Bounds} */
    maxBounds: null,
    /** @type{crisis.MapState} */
    state: crisis.MapState.NORMAL,
    /** @type{jQuery} */
    $mapHolder: null,
    /** @type{jQuery} */
    $mapBounds: null,
    /** @type{jQuery} */
    $addDivisionButton: null
};

/** 
 * @export
 * @param{crisisJson.Crisis} 
 */
crisis.map.init = function(crisisData) {
    var map = crisis.map;
    map.$mapHolder = $("#mapHolder");
    map.$mapBounds = $("#mapBounds");
    map.$mapHolder.draggable({containment: map.$mapBounds});
    
    crisis.ajax.pollNow(crisis.ajax.mapPath, {
        success: function(data) {
            map.updateData(data);
        }
    });
}

crisis.map.updateData = function(crisisData) {
    crisis.map.loc = {
	      x: 0,
	      y: 0
    }
    crisis.map.bounds = { height: crisisData.MapBounds.Height,
                          width: crisisData.MapBounds.Width };
    crisis.map.maxBounds = { height: crisisData.MapBounds.Height,
                             width: crisisData.MapBounds.Width };
    
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
}

/**
 * @param{jQuery} $dropdown
 * @param{jQuery} $source
 * @param{jQuery} $container
 */ 
crisis.map.positionDropdown = function($dropdown, $source, $container) {
    var containerTop = $container.position().top;
    var containerLeft = $container.position().left;
    var containerBottom = containerTop + $container.height();
    var containerRight = containerLeft + $container.width();
    var idealY = $source.position().top + $source.height();
    if (idealY + $dropdown.size() > containerBottom) {
	      idealY += containerBottom - (idealY + $dropdown.size());
    }

    if (idealY < containerTop) {
	      idealY += containerTop - idealY;
    }

    var idealX = $source.position().left + $source.width();
    if (idealX + $dropdown.width() > containerRight) {
	      idealX += containerRight - (idealX + $dropdown.width());
    }

    if (idealX < containerLeft) {
	      idealX += containerLeft - idealX;
    }

    $dropdown.css({
	      "left": idealX,
	      "top": idealY
    });
}

crisis.map.absCoordsOfClick = function(clickEvent) {

}

/** 
 * @param{crisis.Coords} absCoords 
 * @return{crisis.Coords}
 */
crisis.map.relativeCoords = function(absCoords) {
    var map = crisis.map;
    return {
	      x: absCoords.x * 100 / map.maxBounds.width,
	      y: absCoords.y * 100 / map.maxBounds.height
    }
}

/**
 * @param{crisis.Coords}
 * @return{crisis.Coords}
 */
crisis.map.absCoordsOfRelative = function(relativeCoords) {
    return {
	      x: map.bounds.width * relativeCoords.x / 100 + map.loc.x,
	      y: map.bounds.height * relativeCoords.y / 100 + map.loc.y	
    }
}

/**
 * @param{number} factor
 * @param{number} center
 */ 
crisis.map.zoom = function(factor, center) {
    var map = crisis.map;
    
    var newBounds = {
	      height: Math.min(map.bounds.height / factor, map.maxBounds.height),
	      width: Math.min(map.bounds.width / factor, map.maxBounds.width)
    }
    var newLoc = {
	      x: Math.max(0, Math.min(map.maxBounds.width - newBounds.width,
				                        center - newBounds.width)),
	      y: Math.max(0, Math.min(map.maxBounds.height - newBounds.height,
				                        center - newBounds.height))
    }
    map.bounds = newBounds;
    map.loc = newLoc;
    map.positionMap();
}

crisis.map.positionMap = function() {
    var map = crisis.map;
    map.$mapHolder.css({
        "height": (map.maxBounds.height / map.bounds.height * 100) + "%",
        "width": (map.maxBounds.width / map.bounds.width * 100) + "%"
//        "top": "-" + (map.loc.y / map.maxBounds.height * 100) + "%"
 //       "left": "-" + (map.loc.x / map.maxBounds.width * 100) + "%"
    });
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
