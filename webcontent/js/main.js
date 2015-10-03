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
 * @interface
 * @template T
 */
crisis.Updateable = function() {};
/** @param {T} data */
crisis.Updateable.prototype.update = function(data) {};
crisis.Updateable.prototype.destroy = function() {};
/**
 * @param {T} data
 * @return {boolean}
 */
crisis.Updateable.prototype.updateDataMatch = function(data) {};

/**
 * @param {Array<crisis.Updateable<T>>} elements
 * @param {Array<T>} data
 * @param {function(T): crisis.Updateable<T>} elementCreator
 * @template T
 */
crisis.updateElements = function(elements, data, elementCreator) {
    var removedElements = [];
    _.each(elements, function(element) {
        var updateData = _.findWhere(data, updateData.isMatch);
        if (updateData === undefined) {
            element.destroy();
            removedElements.push(elements);
        } else {
            element.update(updateData);
        }

        data = _.without(data, updateData);
    });

    _.each(removedElements, function(removed) {
        elements = _.without(elements, removed);
    });

    _.each(data, function(datum) {
        elements.push(elementCreator(datum));
    });
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
    var num = parseInt($elem.css(style), 10);
    if (num === null || isNaN(num)) {
        console.log(['failed to get css style', $elem, style]);
    }
    return num;
}
