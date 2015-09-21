/** @enum {string} */
crisis.MapState = {
    NORMAL: 'NORMAL',
    GETTING_CLICK: 'GETTING_CLICK'
};

/**
 * @export
 */
crisis.map = {
    /** @type {Array<crisis.Division>} */
    divisions: [],
    /** @type {?crisis.Bounds} */
    absBounds: null,
    /** @type {crisis.Bounds} */
    relBounds: new crisis.Bounds(100, 100),
    /** @type {crisis.Bounds} */
    minRelBounds: new crisis.Bounds(100, 100),
    /** @type {crisis.MapState} */
    state: crisis.MapState.NORMAL,
    /** @type {jQuery} */
    $holder: null,
    /** @type {jQuery} */
    $mapBounds: null,
    /** @type {jQuery} */
    $addDivisionButton: null
};

/** @export */
crisis.map.init = function() {
    crisis.map.$holder = $('#mapHolder');
    crisis.map.$mapBounds = $('#mapBounds');
    crisis.map.$newDivisionButton = $('#newDivisionButton');
    crisis.map.$zoomInButton = $('#zoomInButton');
    crisis.map.$zoomOutButton = $('#zoomOutButton');

    crisis.map.$holder.draggable({containment: crisis.map.$mapBounds});

    crisis.map.$newDivisionButton.on('click' + crisis.event.baseNameSpace,
        function() {
            crisis.map.getClick(function(absCoords) {
                var tmpDiv = new crisis.Division({
                    Id: -1,
                    AbsCoords: absCoords.toJson(),
                    Units: []
                });
                tmpDiv.open();
            });
        });

    crisis.map.$zoomInButton.on('click' + crisis.event.baseNameSpace,
        function() {
            crisis.map.zoom(2);
        });

    crisis.map.$zoomOutButton.on('click' + crisis.event.baseNameSpace,
        function() {
            crisis.map.zoom(0.5);
        });

    crisis.ajax.pollNow(crisis.ajax.mapPath, {
        success: function(data) {
            crisis.map.updateData(data);
        }
    });
};

/** @param {crisisJson.Crisis} crisisData */
crisis.map.updateData = function(crisisData) {
    var map = crisis.map;

    map.absBounds = crisis.Bounds.fromJson(crisisData.MapBounds);

    /** @type {Array<crisis.Division>} */
    var removedDivisions = [];
    _.each(map.divisions, function(div) {
        var updated = _.findWhere(crisisData.Divisions, {Id: div.id});
        if (updated === undefined) {
            div.destroy();
            removedDivisions.push(div);
        } else {
            div.updateData(updated);
        }
        crisisData.Divisions = /** @type {Array<crisisJson.Division>} */
            (_.without(crisisData.Divisions, updated));
    });

    _.each(removedDivisions, function(removedDivision) {
        map.divisions = /** @type {Array<crisis.Division>} */
            (_.without(map.divisions, removedDivision));
    });

    _.each(crisisData.Divisions, function(divJson) {
        map.divisions.push(new crisis.Division(divJson));
    });
};

/**
 * @param {jQuery} $dropdown
 * @param {jQuery} $source
 * @param {jQuery} $container
 */
crisis.map.positionDropdown = function($dropdown, $source, $container) {
    var containerTop = $container.position().top;
    var containerLeft = $container.position().left;
    var containerBottom = containerTop + $container.height();
    var containerRight = containerLeft + $container.width();
    var idealY = $source.position().top + $source.height();
    if (idealY + $dropdown.length > containerBottom) {
        idealY += containerBottom - (idealY + $dropdown.length);
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
        'left': (idealX * 100 / $container.width()) + '%',
        'top': (idealY * 100 / $container.height()) + '%'
    });
};

/**
 * @param {jQuery.Event} clickEvent
 * @return {crisis.Coords}
 */
crisis.map.absCoordsOfClick = function(clickEvent) {
    return new crisis.Coords(0, 0);
};

/**
 * @param {crisis.Coords} absCoords
 * @return {crisis.Coords}
 */
crisis.map.relativeCoordsOfAbs = function(absCoords) {
    var map = crisis.map;
    return new crisis.Coords(absCoords.x * 100 / map.absBounds.width,
                             absCoords.y * 100 / map.absBounds.height);
};

/**
 * @param {crisis.Coords} relativeCoords
 * @return {crisis.Coords}
 */
crisis.map.absCoordsOfRelative = function(relativeCoords) {
    var map = crisis.map;
    return new crisis.Coords(map.absBounds.width * relativeCoords.x / 100,
                             map.absBounds.height * relativeCoords.y / 100);
};

/**
 * @param {number} factor
 */
crisis.map.zoom = function(factor) {
    var map = crisis.map;

    var newBounds = new crisis.Bounds(
        Math.max(map.minRelBounds.width, map.relBounds.width * factor),
        Math.max(map.minRelBounds.height, map.relBounds.height * factor)
    );

    map.bounds = newBounds;

    map.$mapBounds.css({
        'height': (2 * map.bounds.height - 100) + '%',
        'width': (2 * map.bounds.width - 100) + '%',
        'top': '-' + (map.bounds.height - 100) + '%',
        'left': '-' + (map.bounds.width - 100) + '%'
    });
    map.$holder.animate({
        'height': map.bounds.height + '%',
        'width': map.bounds.width + '%',
        'top': map.$holder.css('top') +
            Math.min(map.$holder.css('height') / 4, 0),
        'left': map.$holder.css('left') +
            Math.min(map.$holder.css('width') / 4, 0)
    });

};

/**
 * @param {Array<number>} notInclude
 * @param {jQuery} $positionIn
 * @param {function(?number)} callback
 * @return {function()} a function which cancels this process
 */
crisis.map.showUnitTypeFinder = function(notInclude, $positionIn, callback) {
    var $thisFinder = crisis.cloneProto(crisis.$protoUnitTypeFinder);

    _.each(notInclude, function(num) {
        $thisFinder.children(crisis.unitTypeSelector(num)).remove();
    });

    /** @type {function()} */
    var cancel;

    $thisFinder.children().on('click' + crisis.event.baseNameSpace, function() {
        callback(crisis.getNumericData($(this), 'type'));
        cancel();
    });

    var $children = $positionIn.children();

    cancel = function() {
        $thisFinder.remove();
        $positionIn.append($children);
    };

    $children.detach();
    $positionIn.append($thisFinder);

    return cancel;
};

/** @param {function(crisis.Coords)} callback */
crisis.map.getClick = function(callback) {
    crisis.map.state = crisis.MapState.GETTING_CLICK;

    crisis.map.$holder.on('click' + crisis.event.getClickNameSpace,
        function(clickEvent) {
            var absCoordsOfClick = crisis.map.absCoordsOfRelative(
                new crisis.Coords(clickEvent.offsetX * 100 / crisis.map.$holder.width(),
                                  clickEvent.offsetY * 100 / crisis.map.$holder.height())
            );

            crisis.map.stopGettingClick();
            callback(absCoordsOfClick);
        });
};

crisis.map.stopGettingClick = function() {
    if (!crisis.map.state === crisis.MapState.GETTING_CLICK) return;
    crisis.map.$holder.off('click' + crisis.event.getClickNameSpace);
    crisis.map.state = crisis.MapState.NORMAL;
};
