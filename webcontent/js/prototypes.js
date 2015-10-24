crisis.prototypes {
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
    $protoRoutePoint: null
};

crisis.prototypes.init = function() {
    /** @type {jQuery} */
    var $prototypes = $('#htmlObjectPrototypes');
    crisis.$protoDivisionMarker = $prototypes.find('#protoDivisionMarker');
    crisis.$protoDivisionPane = $prototypes.find('#protoDivisionPane');
    crisis.$protoUnitListItem = $prototypes.find('#protoUnitListItem');
    crisis.$protoUnitTypes = $prototypes.find('#protoUnitTypes');
    crisis.$protoUnitTypeFinder = $prototypes.find('#protoUnitTypeFinder');
    crisis.$protoFactions = $prototypes.find('#protoFactions');
    crisis.$protoRoutePoint = $prototypes.find('#protoRoutePoint');
};
