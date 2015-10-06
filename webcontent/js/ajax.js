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
crisis.ajax.mapPath = crisis.ajax.path + 'map/';
/**
 * @const
 *  @type {string}
  */
crisis.ajax.updateDivisionPath = crisis.ajax.path + 'updateDivision/';
/**
 * @const
 *  @type {string}
  */
crisis.ajax.createDivisionPath = crisis.ajax.path + 'createDivision/';
/**
 * @const
 *  @type {string}
  */
crisis.ajax.deleteDivisionPath = crisis.ajax.path + 'deleteDivision/';

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
 * @param {string} url
 * @param {jQueryAjaxSettings=} ajaxSettings
 * @param {number=} frequency
 */
crisis.ajax.poll = function(url, ajaxSettings, frequency) {
    if (frequency === undefined) frequency = 10000;

    setTimeout(function() {
        $.ajax(url, ajaxSettings);
        crisis.ajax.poll(url, ajaxSettings, frequency);
    }, frequency);
};

/**
 * @param {string} url
 * @param {jQueryAjaxSettings=} ajaxSettings
 * @param {number=} frequency
 */
crisis.ajax.pollNow = function(url, ajaxSettings, frequency) {
    $.ajax(url, ajaxSettings);
    crisis.ajax.poll(url, ajaxSettings, frequency);
}
