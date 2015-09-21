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
    /** @type {jQuery} */
    $protoUnitTypeFinder: null
};

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
    return '[data-type=' + typeNum + ']';
};

/**
 * @param {jQuery} $elem
 * @param {string} dataName
 * @return {?number}
 */
crisis.getNumericData = function($elem, dataName) {
    return parseInt($elem.data(dataName), 10);
};

/**
 * @param {jQuery} $elem
 * @param {string} style
 * @return {number}
 */
crisis.getCssPx = function($elem, style) {
    return parseInt($elem.css('style'), 10);
}
