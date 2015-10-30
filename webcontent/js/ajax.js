crisis.ajax = {};
/**
 * @const
 * @type {string}
 */
crisis.ajax.path = 'ajax/';
/**
 * @const
 * @type {string}
 */
crisis.ajax.crisisPath = crisis.ajax.path + 'crisis/';
/**
 * @const
 * @type {string}
 */
crisis.ajax.updateDivisionPath = crisis.ajax.path + 'updateDivision/';
/**
 * @const
 * @type {string}
 */
crisis.ajax.updateDivisionVisibilityPath =
    crisis.ajax.path + 'updateDivisionVisibility/';
/**
 * @const
 * @type {string}
 */
crisis.ajax.createDivisionPath = crisis.ajax.path + 'createDivision/';
/**
 * @const
 * @type {string}
 */
crisis.ajax.deleteDivisionPath = crisis.ajax.path + 'deleteDivision/';
/**
 * @const
 * @type {string}
 */
crisis.ajax.divisionRoutePath = crisis.ajax.path + 'divisionRoute/';
/**
 * @const
 * @type {string}
 */
crisis.ajax.createFactionPath = crisis.ajax.path + 'createFaction/';
/**
 * @const
 * @type {string}
 */
crisis.ajax.updateFactionPath = crisis.ajax.path + 'updateFaction/';
/**
 * @const
 * @type {string}
 */
crisis.ajax.deleteFactionPath = crisis.ajax.path + 'deleteFaction/';
/**
 * @const
 * @type {string}
 */
crisis.ajax.createUnitTypePath = crisis.ajax.path + 'createUnitType/';
/**
 * @const
 * @type {string}
 */
crisis.ajax.updateUnitTypePath = crisis.ajax.path + 'updateUnitType/';
/**
 * @const
 * @type {string}
 */
crisis.ajax.deleteUnitTypePath = crisis.ajax.path + 'deleteUnitType/';

/**
 * @param {string} path
 * @param {Object} data
 * @param {jQueryAjaxSettings=} options
 */
crisis.ajax.postData = function(path, data, options) {
    if (options === null || options === undefined) options = {};
    options.type = 'POST';
    options.data = JSON.stringify(data);
    console.log(options.data);
    options.dataType = 'json';
    options.contentType = 'application/json; charset=utf-8';
    $.ajax(path, options);
};

/**
 * @param {number} divisionId
 * @param {Array<crisisJson.Unit>} units
 * @param {string?} name
 * @param {number?} factionId
 * @param {jQueryAjaxSettings=} options
 */
crisis.ajax.postDivisionUpdate = function(
    divisionId, units, name, factionId, options)
{
    /** @type {crisisJson.DivisionUpdate} */
    var data = {
        Id: divisionId,
        Units: units,
        Name: name,
        FactionId: factionId
    };
    crisis.ajax.postData(crisis.ajax.updateDivisionPath, data, options);
};

/**
 * @param {Array<number>} newVisibility
 * @param {number} divisionId
 * @param {jQueryAjaxSettings=} options
 */
crisis.ajax.postDivisionVisibilityUpdate = function(
    newVisibility, divisionId, options)
{
    /** @type {crisisJson.DivisionVisibilityUpdate} */
    var data = {
        VisibleTo: newVisibility,
        DivisionId: divisionId
    };
    crisis.ajax.postData(crisis.ajax.updateDivisionVisibilityPath,
                         data, options);
};

/**
 * @param {crisis.Coords} coords
 * @param {Array<crisisJson.Unit>} units
 * @param {string} name
 * @param {number} factionId
 * @param {jQueryAjaxSettings=} options
 */
crisis.ajax.postDivisionCreation = function(
    coords, units, name, factionId, options)
{
    /** @type {crisisJson.DivisionCreate} */
    var data = {
        Units: units,
        Coords: coords,
        Name: name,
        FactionId: factionId
    };
    crisis.ajax.postData(crisis.ajax.createDivisionPath, data, options);
};

/**
 * @param {number} divisionId
 * @param {jQueryAjaxSettings=} options
 **/
crisis.ajax.postDivisionDeletion = function(divisionId, options) {
    /** @type {crisisJson.DivisionDelete} */
    var data = {
        DivisionId: divisionId
    };
    crisis.ajax.postData(crisis.ajax.deleteDivisionPath, data, options);
};

/**
 * @param {number} divisionId
 * @param {Array<crisisJson.Coords>} route
 * @param {jQueryAjaxSettings=} options
 */
crisis.ajax.postDivisionRoute = function(divisionId, route, options) {
    /** @type {crisisJson.DivisionRoute} */
    var data = {
        DivisionId: divisionId,
        Route: route
    };
    crisis.ajax.postData(crisis.ajax.divisionRoutePath, data, options);
};

/**
 * @param {string} name
 * @param {string} color
 * @param {jQueryAjaxSettings=} options
 */
crisis.ajax.postFactionCreation = function(name, color, options) {
    /** @type {crisisJson.CreateFaction} */
    var data = {
        Name: name,
        Color: color
    };
    crisis.ajax.postData(crisis.ajax.createFactionPath, data, options);
};

/**
 * @param {number} id
 * @param {jQueryAjaxSettings=} options
 */
crisis.ajax.postFactionDeletion = function(id, options) {
    /** @type {crisisJson.DeleteFaction} */
    var data = { Id: id };
    crisis.ajax.postData(crisis.ajax.deleteFactionPath, data, options);
};

/**
 * @param {string} name
 * @param {string} color
 * @param {number} id
 * @param {jQueryAjaxSettings=} options
 */
crisis.ajax.postFactionUpdate = function(name, color, id, options) {
    /** @type {crisisJson.DeleteFaction} */
    var data = {
        Id: id,
        Name: name,
        Color: color
    };
    crisis.ajax.postData(crisis.ajax.updateFactionPath, data, options);
};

/**
 * @param {string} name
 * @param {jQueryAjaxSettings=} options
 */
crisis.ajax.postUnitTypeCreation = function(name, options) {
    /** @type {crisisJson.CreateUnitType} */
    var data = { Name: name };
    crisis.ajax.postData(crisis.ajax.createUnitTypePath, data, options);
};

/**
 * @param {number} id
 * @param {jQueryAjaxSettings=} options
 */
crisis.ajax.postUnitTypeDeletion = function(id, options) {
    /** @type {crisisJson.DeleteUnitType} */
    var data = { Id: id };
    crisis.ajax.postData(crisis.ajax.deleteUnitTypePath, data, options);
};

/**
 * @param {string} name
 * @param {number} id
 * @param {jQueryAjaxSettings=} options
 */
crisis.ajax.postUnitTypeUpdate = function(name, id, options) {
    /** @type {crisisJson.DeleteUnitType} */
    var data = {
        Id: id,
        Name: name
    };
    crisis.ajax.postData(crisis.ajax.updateUnitTypePath, data, options);
};

/**
 * @param {string} url
 * @param {Object} data
 * @param {jQueryAjaxSettings=} ajaxSettings
 * @param {number=} frequency
 */
crisis.ajax.poll = function(url, data, ajaxSettings, frequency) {
    if (frequency === undefined) frequency = 10000;

    setTimeout(function() {
        crisis.ajax.postData(url, data, ajaxSettings);
        crisis.ajax.poll(url, data, ajaxSettings, frequency);
    }, frequency);
};

/**
 * @param {string} url
 * @param {Object} data
 * @param {jQueryAjaxSettings=} ajaxSettings
 * @param {number=} frequency
 */
crisis.ajax.pollNow = function(url, data, ajaxSettings, frequency) {
    crisis.ajax.postData(url, data, ajaxSettings);
    crisis.ajax.poll(url, data, ajaxSettings, frequency);
}
