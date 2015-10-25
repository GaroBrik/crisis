/** @export */
var crisis = {
    /** @type {buckets.Dictionary<number, !crisis.Division>} */
    divisions: new buckets.Dictionary(),
    /** @type {buckets.Dictionary<number, !crisis.Faction>} */
    factions: new buckets.Dictionary(),
    /** @type {buckets.Dictionary<number, !crisis.UnitType>} */
    unitTypes: new buckets.Dictionary()
};

/** @export */
crisis.init = function() {
    crisis.prototypes.init();
    crisis.controls.initialize();
    crisis.map.init();

    crisis.ajax.pollNow(crisis.ajax.crisisPath, {
        /** @param {crisisJson.Crisis} json */
        success: function(json) {
            crisis.updateData(json);
        }
    });
};

/** @param {crisisJson.Crisis} json */
crisis.updateData = function(json) {
    crisis.map.updateData(json);

    crisis.updateElements(
        crisis.factions, json.Factions, crisis.Faction.fromJson,
        function(json) { return json.Id; }
    );

    crisis.updateElements(
        crisis.unitTypes, json.UnitTypes, crisis.UnitType.fromJson,
        function(json) { return json.Id; }
    );

    crisis.updateElements(
        crisis.divisions, json.Divisions, crisis.Division.fromJson,
        function(json) { return json.Id; }
    );

    crisis.controls.reRender();
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
 * TODO: parametrize dictionary without bothering closure compiler
 * @param {buckets.Dictionary} elements
 * @param {Array<T>} data
 * @param {function(T): crisis.Updateable<T>} elementCreator
 * @param {function(T): K} keyGetter
 * @template T, K
 */
crisis.updateElements = function(elements, data, elementCreator, keyGetter) {
    /** @type {buckets.Dictionary} */
    var newElements = new buckets.Dictionary();
    _.each(data, function(datum) {
        var elem = elements.get(keyGetter(datum));
        
        if (elem === undefined) {
            newElements.set(keyGetter(datum), elementCreator(datum));
        } else {
            elem.update(datum);
            elements.remove(keyGetter(datum));
            newElements.set(keyGetter(datum), elem);
        }
    });

    elements.forEach(function(key, value) { value.destroy(); });
    elements.clear();
    newElements.forEach(function(key, value) { elements.set(key, value); });
};

/** @param {crisis.Division} div */
crisis.addDivision = function(div) {
    if (crisis.divisions.set(div.id, div) !== undefined) {
        console.log('tried to add existing division:');
        console.log(div);
    }
};

/** 
 * @param {number} divId 
 * @return {crisis.Division}
 */
crisis.getDivision = function(divId) {
    if (!crisis.divisions.containsKey(divId)) {
        console.log('tried to get non-existent division: ' + divId);
    }
    return crisis.divisions.get(divId);
};

/** @param {number} divId */
crisis.removeDivision = function(divId) {
    if (!crisis.divisions.containsKey(divId)) {
        console.log('tried to remove non-existent division: ' + divId);
    }
    crisis.divisions.remove(divId);
};

/** @param {crisis.Faction} faction */
crisis.addFaction = function(faction) {
    if (crisis.factions.set(faction.id, faction) !== undefined) {
        console.log('tried to add existing faction:');
        console.log(faction);
    }
};

/** 
 * @param {number} facId 
 * @return {crisis.Faction}
 */
crisis.getFaction = function(facId) {
    if (!crisis.factions.containsKey(facId)) {
        console.log('tried to get non-existent faction: ' + facId);
    }
    return crisis.factions.get(facId);
};

/** @param {number} facId */
crisis.removeFaction = function(facId) {
    if (!crisis.factions.containsKey(facId)) {
        console.log('tried to remove non-existent faction: ' + facId);
    }
    crisis.factions.remove(facId);
};

/** @param {crisis.UnitType} unitType */
crisis.addUnitType = function(unitType) {
    if (crisis.unitTypes.set(unitType.id, unitType) !== undefined) {
        console.log('added existing unit type:');
        console.log(unitType);
    }
};

/** 
 * @param {number} typeId 
 * @return {crisis.UnitType}
 */
crisis.getUnitType = function(typeId) {
    if (!crisis.unitTypes.containsKey(typeId)) {
        console.log('tried to get non-existent unit type: ' + typeId);
    }
    return crisis.unitTypes.get(typeId);
};

/** @param {number} typeId */
crisis.removeUnitType = function(typeId) {
    if (!crisis.unitTypes.containsKey(typeId)) {
        console.log('tried to remove non-existent unit type: ' + typeId);
    }
    crisis.unitTypes.remove(typeId);
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
        crisis.prototypes.$factions.find(
            crisis.dataSelector(id, 'faction')));
};
