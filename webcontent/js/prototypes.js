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
    $unitTypeChooser: null,
    /** @type {jQuery} */
    $typeChooserButton: null,
    /** @type {jQuery} */
    $factions: null,
    /** @type {jQuery} */
    $routePoint: null,
    /** @type {jQuery} */
    $controlsFactionListItem: null,
    /** @type {jQuery} */
    $controlsUnitTypeListItem: null,
    /** @type {jQuery} */
    $factionSelector: null
};

crisis.prototypes.init = function() {
    /** @type {jQuery} */
    var $prototypes = $('#htmlObjectPrototypes');
    crisis.prototypes.$divisionMarker =
        $prototypes.find('#protoDivisionMarker');
    crisis.prototypes.$divisionPane = $prototypes.find('#protoDivisionPane');
    crisis.prototypes.$unitListItem = $prototypes.find('#protoUnitListItem');
    crisis.prototypes.$unitTypes = $prototypes.find('#protoUnitTypes');
    crisis.prototypes.$unitTypeChooser =
        $prototypes.find('#protoUnitTypeChooser');
    crisis.prototypes.$typeChooserButton =
        $prototypes.find('#protoTypeChooserButton');
    crisis.prototypes.$factions = $prototypes.find('#protoFactions');
    crisis.prototypes.$routePoint = $prototypes.find('#protoRoutePoint');
    crisis.prototypes.$controlsFactionListItem =
        $prototypes.find('#protoFactionListItem');
    crisis.prototypes.$controlsUnitTypeListItem =
        $prototypes.find('#protoUnitTypeListItem');
    crisis.prototypes.$factionSelector =
        $prototypes.find('#protoFactionSelector');
};

/**
 * @param {crisis.UnitType} type
 * @param {function(number)} callback
 * @return {jQuery}
 */
crisis.prototypes.typeChooserButton = function(type, callback) {
    var $button = /** @type {jQuery} */ (
        crisis.cloneProto(crisis.prototypes.$typeChooserButton)
            .val(type.name)
    );

    $button.on('click' + crisis.event.baseNameSpace, function() {
        callback(type.id);
    });

    return $button;
};
