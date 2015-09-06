/**
 * @typedef{{
 *   Bounds: crisis.Bounds, 
 *   Divisions: Array<crisis.DivisionData>
 * }}
 */
crisis.MapData;

/**
 * @constructor
 * @export
 * @param {crisis.MapData} mapData
 */
crisis.Map = function(mapData) {
    console.log(mapData.Divisions);
    /** @type{Array<crisis.Division>} */
    this.Divisions = _.map(mapData.Divisions, function(divData) {
        console.log(divData);
	      return new crisis.Division(divData);
    });
    /** @type{crisis.Coords} */ 
    this.Loc = {
	      X: 0,
	      Y: 0
    }
    /** @type{crisis.Bounds} */
    this.Bounds = mapData.Bounds;
    /** @type{crisis.Bounds} */
    this.MaxBounds = mapData.Bounds; 

    this.positionDivisions();
}

/**
 * @param {jQuery} $dropdown
 * @param {jQuery} $source
 */ 
crisis.Map.prototype.positionDropdown = function($dropdown, $source) {
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

/** 
 * @param {crisis.Coords} absCoords 
 * @return {crisis.Coords}
 */
crisis.Map.prototype.relativeCoords = function(absCoords) {
    var map = this;
    return {
	      X: (absCoords.X - map.Loc.X) / map.Bounds.Width,
	      Y: (absCoords.Y - map.Loc.Y) / map.Bounds.Height
    }
}

/**
 * @param {crisis.Coords}
 * @return {crisis.Coords}
 */
crisis.Map.prototype.absCoords = function(relativeCoords) {
    return {
	      X: map.Bounds.Width * relativeCoords.X + map.Loc.X,
	      Y: map.Bounds.Height * relativeCoords.Y + map.Loc.Y	
    }
}

/**
 * @param {number} factor
 * @param {number} center
 */ 
crisis.Map.prototype.zoom = function(factor, center) {
    var map = this;
    
    var newBounds = {
	      Height: Math.min(map.Bounds.Height * factor, map.MaxBounds.Height),
	      Width: Math.min(map.Bounds.Width * factor, map.MaxBounds.Width)
    }
    var newLoc = {
	      X: Math.max(0, Math.min(map.MaxBounds.Width - newBounds.Width,
				                        center - newBounds.Width)),
	      Y: Math.max(0, Math.min(map.MaxBounds.Height - newBounds.Height,
				                        center - newBounds.Height))
    }
    map.Bounds = newBounds;
    map.Loc = newLoc;
    map.positionDivisions();
}

/**
 * @param {number} xPercent
 * @param {number} yPercent
 */
crisis.Map.prototype.move = function(xPercent, yPercent) {
    var map = this;
    map.Loc = {
	      X: Math.max(0, Math.min(map.MaxBounds.Width - newBounds.Width,
				                        map.Loc.X - xPercent * map.Bounds.Width)),
	      Y: Math.max(0, Math.min(map.MaxBounds.Height - newBounds.Height,
				                        map.Loc.Y - yPercent * map.Bounds.Height))
    }
    map.positionDivisions();
}

crisis.Map.prototype.positionDivisions = function() {
    var map = this;

    _.each(map.Divisions, function(div) {
	      var rel = map.relativeCoords(div.AbsCoords);
	      if (0 <= rel.X && rel.X <= 100 && 0 <= rel.Y && rel.Y <= 100) {
	          div.$marker.css({
		            "left": rel.X + "%",
		            "top": rel.Y + "%"
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
