/** @export */
crisis = {
    /** @type{jQuery} */
    $g_protoDivisionMarker: null,
    /** @type{jQuery} */
    $g_protoDivisionDetails: null,
    /** @type{jQuery} */
    $g_protoUnitListItem: null,
    /** @type{jQuery} */
    $g_protoUnitTypes: null,
    /** @type{jQuery} */
    $g_mapHolder: null
}

/** 
 * @export 
 */
crisis.Init = function() {
	  var $prototypes = $("#htmlObjectPrototypes");
	  crisis.$g_protoDivisionMarker = $prototypes.find("#protoDivisionMarker");
	  crisis.$g_protoDivisionDetails = $prototypes.find("#protoDivisionDetails");
	  crisis.$g_protoUnitListItem = $prototypes.find("#protoUnitListItem");
	  crisis.$g_protoUnitTypes = $prototypes.find("#protoUnitTypes");
    crisis.$g_mapHolder = $("#mapHolder");
}

/**
 * @typedef{{
 *   X: number,
 *   Y: number
 * }}
 */
crisis.Coords;

/**
 * @typedef{{
 *   Height: number,
 *   Width: number
 * }}
 */
crisis.Bounds;
