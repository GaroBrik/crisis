/** @export */
var crisis = {
    /** @type {jQuery} */
    $protoDivisionMarker: null,
    /** @type {jQuery} */
    $protoDivisionDetails: null,
    /** @type {jQuery} */
    $protoUnitListItem: null,
    /** @type {jQuery} */
    $protoUnitTypes: null,
    /** @type {jQuery} */u
    $protoUnitTypeFinder: null
}

/** @export */
crisis.init = function() {
    var $prototypes = $('#htmlObjectPrototypes');
    crisis.$protoDivisionMarker = $prototypes.find('#protoDivisionMarker');
    crisis.$protoDivisionDetails = $prototypes.find('#protoDivisionDetails');
    crisis.$protoUnitListItem = $prototypes.find('#protoUnitListItem');
    crisis.$protoUnitTypes = $prototypes.find('#protoUnitTypes');
    crisis.$protoUnitTypeFinder = $prototypes.find('#protoUnitTypeFinder');
};

/**
 * @param {jQuery} $proto
 * @return {jQuery}
 */
crisis.cloneProto = function($proto) {
    var ret = $proto.clone();
    ret.attr('id', '');
    return ret;
};

/**
 * @param {number} typeNum
 * @return {string}
 */
crisis.unitTypeSelector = function(typeNum) {
    return '[data-type=' + typeNum + ']'
};

/**
 * @typedef {{
 *   x: number,
 *   y: number
 * }}
 */
crisis.Coords;

/**
 * @typedef {{
 *   height: number,
 *   width: number
 * }}
 */
crisis.Bounds;
