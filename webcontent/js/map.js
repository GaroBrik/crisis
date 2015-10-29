/** @enum {string} */
crisis.MapState = {
    NORMAL: 'NORMAL',
    GETTING_CLICK: 'GETTING_CLICK'
};

/**
 * @export
 */
crisis.map = {
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
    $image: null,
    /** @type {jQuery} */
    $mapBounds: null,
    /** @type {jQuery} */
    $outerMapDiv: null,
    /** @type {jQuery} */
    $newDivisionButton: null,
    /** @type {jQuery} */
    $controlsButton: null,
    /** @type {boolean} */
    zooming: false,
    /** @type {function()} */
    zoomStack: function() {}
};

/** @export */
crisis.map.init = function() {
    crisis.map.$holder = $('#mapHolder');
    crisis.map.$image = $('#mapImage');
    crisis.map.$mapBounds = $('#mapBounds');
    crisis.map.$outerMapDiv = $('#mapOuterDiv');
    crisis.map.$newDivisionButton = $('#newDivisionButton');
    crisis.map.$controlsButton = $('#controlsButton');

    crisis.map.$holder.draggable({containment: crisis.map.$mapBounds});

    crisis.map.$newDivisionButton.on('click' + crisis.event.baseNameSpace,
        function() {
            crisis.map.getClick(function(absCoords) {
                crisis.DivisionDetails.forCreation(absCoords);
            });
        });

    crisis.map.$image.on('mousewheel' + crisis.event.baseNameSpace,
        function(event) {
            /** @type {number} */
            var factor = event.deltaY > 0 ? 2 : 0.5;

            crisis.map.zoom(factor, new crisis.Coords(
                event.pageX - crisis.map.$outerMapDiv.position().left -
                    crisis.getCssPx(crisis.map.$holder, 'left'),
                event.pageY - crisis.map.$outerMapDiv.position().top -
                    crisis.getCssPx(crisis.map.$holder, 'top')
            ));
        });

    crisis.map.$controlsButton.on('click' + crisis.event.baseNameSpace,
                                  crisis.controls.toggle);
};

/** @param {crisisJson.Crisis} crisisData */
crisis.map.updateData = function(crisisData) {
    crisis.map.absBounds = crisis.Bounds.fromJson(crisisData.MapBounds);
};

/**
 * @param {jQuery} $dropdown
 * @param {jQuery} $source
 */
crisis.map.positionDropdown = function($dropdown, $source) {
    crisis.positionDropdown($dropdown, $source, crisis.map.$holder);
};

/**
 * @param {crisis.Coords} absCoords
 * @return {crisis.Coords}
 */
crisis.map.relativeCoordsOfAbs = function(absCoords) {
    return new crisis.Coords(absCoords.x * 100 / crisis.map.absBounds.width,
                             absCoords.y * 100 / crisis.map.absBounds.height);
};

/**
 * @param {crisis.Coords} relCoords
 * @return {crisis.Coords}
 */
crisis.map.absCoordsOfRelative = function(relCoords) {
    return new crisis.Coords(
        Math.round(crisis.map.absBounds.width * relCoords.x / 100),
        Math.round(crisis.map.absBounds.height * relCoords.y / 100)
    );
};

/**
 * @param {number} factor
 * @param {crisis.Coords} fixPoint
 */
crisis.map.zoom = function(factor, fixPoint) {
    if (crisis.map.zooming) {
        crisis.map.stackZoom = function() {
            crisis.map.zooming = false;
            crisis.map.zoom(factor, fixPoint)
        };
        return;
    }

    crisis.map.stackZoom = function() { crisis.map.zooming = false; };

    var newBounds = new crisis.Bounds(
        Math.min(crisis.map.minRelBounds.width * 5,
                 Math.max(crisis.map.minRelBounds.width,
                          crisis.map.relBounds.width * factor)),
        Math.min(crisis.map.minRelBounds.height * 5,
                 Math.max(crisis.map.minRelBounds.height,
                          crisis.map.relBounds.height * factor))
    );

    var newFactor = newBounds.width / crisis.map.relBounds.width;

    var holderLeft = crisis.getCssPx(crisis.map.$holder, 'left');
    var holderWidth = crisis.getCssPx(crisis.map.$holder, 'width');
    var holderTop = crisis.getCssPx(crisis.map.$holder, 'top');
    var holderHeight = crisis.getCssPx(crisis.map.$holder, 'height');
    var outerWidth = crisis.getCssPx(crisis.map.$outerMapDiv, 'width');
    var outerHeight = crisis.getCssPx(crisis.map.$outerMapDiv, 'height');

    var absOuterFixPoint = new crisis.Coords(
        fixPoint.x + holderLeft,
        fixPoint.y + holderTop
    );

    var absMapFixOrigPoint = new crisis.Coords(
        fixPoint.x * newFactor + holderLeft,
        fixPoint.y * newFactor + holderTop
    );

    var absMapFixDelta = new crisis.Coords(
        absOuterFixPoint.x - absMapFixOrigPoint.x,
        absOuterFixPoint.y - absMapFixOrigPoint.y
    );

    if (holderLeft + holderWidth * newFactor + absMapFixDelta.x < outerWidth) {
        absMapFixDelta.x += outerWidth -
            (holderLeft + holderWidth * newFactor + absMapFixDelta.x);
    }
    if (holderLeft + absMapFixDelta.x > 0) {
        absMapFixDelta.x -= (holderLeft + absMapFixDelta.x);
    }
    if (holderTop + holderHeight * newFactor + absMapFixDelta.y < outerHeight) {
        absMapFixDelta.y += outerHeight -
            (holderTop + holderHeight * newFactor + absMapFixDelta.y);
    }
    if (holderTop + absMapFixDelta.y > 0) {
        absMapFixDelta.y -= (holderTop + absMapFixDelta.y);
    }

    crisis.map.relBounds = newBounds;

    crisis.map.$mapBounds.css({
        'height': (2 * crisis.map.relBounds.height - 100) + '%',
        'width': (2 * crisis.map.relBounds.width - 100) + '%',
        'top': '-' + (crisis.map.relBounds.height - 100) + '%',
        'left': '-' + (crisis.map.relBounds.width - 100) + '%'
    });
    crisis.map.$holder.animate({
        'height': crisis.map.relBounds.height + '%',
        'width': crisis.map.relBounds.width + '%',
        'top': (holderTop + absMapFixDelta.y) + 'px',
        'left': (holderLeft + absMapFixDelta.x) + 'px'
    }, {
        easing: 'linear',
        done: crisis.map.stackZoom
    });

    crisis.map.zooming = true;
};

/**
 * @param {jQuery.Event} clickEvent
 * @return {crisis.Coords}
 */
crisis.map.absCoordsOfClick = function(clickEvent) {
    console.log(
        new crisis.Coords(
            (clickEvent.pageX - crisis.map.$holder.offset().left) * 100 /
                crisis.map.$holder.width(),
            (clickEvent.pageY - crisis.map.$holder.offset().top) * 100 /
                crisis.map.$holder.height()
        )
    );
    return crisis.map.absCoordsOfRelative(
        new crisis.Coords(
            (clickEvent.pageX - crisis.map.$holder.offset().left) * 100 /
                crisis.map.$holder.width(),
            (clickEvent.pageY - crisis.map.$holder.offset().top) * 100 /
                crisis.map.$holder.height()
        )
    );
};

/** @param {function(crisis.Coords)} callback */
crisis.map.getClick = function(callback) {
    crisis.map.$image.on('click' + crisis.event.getClickNameSpace,
        function(clickEvent) {
            crisis.map.stopGettingClick();
            callback(crisis.map.absCoordsOfClick(clickEvent));
        });

    crisis.map.state = crisis.MapState.GETTING_CLICK;
};

crisis.map.stopGettingClick = function() {
    if (crisis.map.state !== crisis.MapState.GETTING_CLICK) return;
    crisis.map.$image.off('click' + crisis.event.getClickNameSpace);
    crisis.map.state = crisis.MapState.NORMAL;
};

/**
 * @param {jQuery} $elem
 * @param {crisis.Coords} absCoords
 */
crisis.map.position = function($elem, absCoords) {
    var rel = crisis.map.relativeCoordsOfAbs(absCoords);
    $elem.css({
        'left': rel.x + '%',
        'top': rel.y + '%'
    });
};

/** @param {jQuery} $elem */
crisis.map.add = function($elem) {
    crisis.map.$holder.append($elem);
};

/**
 * @param {jQuery} $elem
 * @param {crisis.Coords} absCoords
 */
crisis.map.addAt = function($elem, absCoords) {
    crisis.map.position($elem, absCoords);
    crisis.map.add($elem);
};
