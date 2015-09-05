crisis = {
    /** @type{jQuery} */
    $g_protoDivisionMarker: null,
    /** @type{jQuery} */
    $g_protoDivisionDetails: null,
    /** @type{jQuery} */
    $g_protoUnitListItem: null,
    /** @type{jQuery} */
    $g_protoUnitTypes: null,
    
    init: function() {
	      var $prototypes = $("#htmlObjectPrototypes");
	      this.$g_protoDivisionMarker = $prototypes.find("#protoDivisionMarker");
	      this.$g_protoDivisionDetails = $prototypes.find("#protoDivisionDetails");
	      this.$g_protoUnitListItem = $prototypes.find("#protoUnitListItem");
	      this.$g_protoUnitTypes = $prototypes.find("#protoUnitTypes");
    }
}

/**
 * @typedef{{
 *   x: number,
 *   y: number
 * }}
 */
crisis.Coords;

/**
 * @typedef{{
 *   height: number,
 *   width: number
 * }}
 */
crisis.Bounds;
