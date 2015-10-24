crisis.prototypes = {
    /** @type {jQuery} */
    $divisionMarker: null,
    /** @type {jQuery} */
    $divisionPane: null,
    /** @type {jQuery} */
    $unitListItem: null,
    /** @type {jQuery} */
    $unitTypes: null,
    /** @type {jQuery} */
    $unitTypeFinder: null,
    /** @type {jQuery} */
    $factions: null,
    /** @type {jQuery} */
    $routePoint: null,
    /** @type {jQuery} */
    $controlsFactionListItem: null,
    /** @type {jQuery} */
    $controlsUnitTypeListItem: null
};

crisis.prototypes.init = function() {
    /** @type {jQuery} */
    var $prototypes = $('#htmlObjectPrototypes');
    crisis.prototypes.$divisionMarker =
        $prototypes.find('#protoDivisionMarker');
    crisis.prototypes.$divisionPane = $prototypes.find('#protoDivisionPane');
    crisis.prototypes.$unitListItem = $prototypes.find('#protoUnitListItem');
    crisis.prototypes.$unitTypes = $prototypes.find('#protoUnitTypes');
    crisis.prototypes.$unitTypeFinder =
        $prototypes.find('#protoUnitTypeFinder');
    crisis.prototypes.$factions = $prototypes.find('#protoFactions');
    crisis.prototypes.$routePoint = $prototypes.find('#protoRoutePoint');
    crisis.prototypes.$controlsFactionListItem =
        $prototypes.find('#protoFactionListItem');
    crisis.prototypes.$controlsUnitTypeListItem =
        $prototypes.find('#protoUnitTypeListItem');
};
