/** @export */
var crisis = {
    /** @type {jQuery} */
    $protoDivisionMarker: null,
    /** @type {jQuery} */
    $protoDivisionPane: null,
    /** @type {jQuery} */
    $protoUnitListItem: null,
    /** @type {jQuery} */
    $protoUnitTypes: null,
    /** @type {jQuery} */
    $protoUnitTypeFinder: null,
    /** @type {jQuery} */
    $protoFactions: null,
    /** @type {jQuery} */
    $routePoint: null
};

/** @export */
crisis.init = function() {
    var $prototypes = $('#htmlObjectPrototypes');
    crisis.$protoDivisionMarker = $prototypes.find('#protoDivisionMarker');
    crisis.$protoDivisionPane = $prototypes.find('#protoDivisionPane');
    crisis.$protoUnitListItem = $prototypes.find('#protoUnitListItem');
    crisis.$protoUnitTypes = $prototypes.find('#protoUnitTypes');
    crisis.$protoUnitTypeFinder = $prototypes.find('#protoUnitTypeFinder');
    crisis.$protoFactions = $prototypes.find('#protoFactions');
    crisis.$routePoint = $prototypes.find('#protoRoutePoint');
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
        var updateData = _.find(data,
            function(datum) { return element.updateDataMatch(datum); });
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
 * @param {number|string} data
 * @param {string} dataName
 * @return {string}
 */
crisis.dataSelector = function(data, dataName) {
    return '[data-' + dataName + '=' + data + ']';
};

/**
 * @param {string} str
 * @return {number}
 */
crisis.stringToInt = function(str) {
    /** @type {number} */
    var num = parseInt(str, 10);
    if (num === null || isNaN(num)) {
        console.log('failed to convert string ' + str + ' to a number');
    }
    return num;
};

/**
 * @param {jQuery} $elem
 * @param {string} dataName
 * @return {?number}
 */
crisis.getNumericData = function($elem, dataName) {
    return crisis.stringToInt(/** @type {string} */ ($elem.data(dataName)));
};

/**
 * @param {jQuery} $elem
 * @param {string} style
 * @return {number}
 */
crisis.getCssPx = function($elem, style) {
    return crisis.stringToInt(/** @type {string} */ ($elem.css(style)));
};

/**
 * @param {jQuery} $dropdown
 * @param {jQuery} $source
 * @param {jQuery} $container
 */
crisis.positionDropdown = function($dropdown, $source, $container) {
    var containerTop = $container.position().top;
    var containerLeft = $container.position().left;
    var containerBottom = containerTop + $container.height();
    var containerRight = containerLeft + $container.width();
    var idealY =
        $source.position().top + $source.height() / 2 - $dropdown.height() / 2;
    if (idealY + $dropdown.height() > containerBottom) {
        idealY += containerBottom - (idealY + $dropdown.height());
    }

    if (idealY < containerTop) {
        idealY += containerTop - idealY;
    }

    var idealX =
        $source.position().left + $source.width() / 2 - $dropdown.width() / 2;
    if (idealX + $dropdown.width() > containerRight) {
        idealX += containerRight - (idealX + $dropdown.width());
    }

    if (idealX < containerLeft) {
        idealX += containerLeft - idealX;
    }

    $dropdown.css({
        'left': ($source.position().left * 100 / $container.width()) + '%',
        'top': ($source.position().top * 100 / $container.height()) + '%',
        'margin-left': (idealX - $source.position().left) + 'px',
        'margin-top': (idealY - $source.position().top) + 'px'
    });
};

/**
 * @param {number} id
 * @return {jQuery}
 */
crisis.factionHtml = function(id) {
    return crisis.cloneProto(
        crisis.$protoFactions.find(crisis.dataSelector(id, 'faction')));
};
