crisis.ajax = {};
crisis.ajax.path = 'ajax/';
crisis.ajax.mapPath = crisis.ajax.path + 'map/';
crisis.ajax.updateDivisionPath = crisis.ajax.path + 'updateDivision/';

/**
 * @param {string} path
 * @param {Object} data
 * @param {Object} options
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
 * @param {Object} options
 */
crisis.ajax.postDivisionUpdate = function(divisionId, units, options) {
    /** @type {crisisJson.Division} */
    var data = {
        Id: divisionId,
        Units: units
    };
    crisis.ajax.postData(crisis.ajax.updateDivisionPath, data, options);
};

/**
 * @param {string} url
 * @param {Object} ajaxSettings
 * @param {number} frequency
 */
crisis.ajax.poll = function(url, ajaxSettings, frequency) {
    if (frequency === undefined) frequency = 10000;

    setTimeout(frequency, function() {
        $.ajax(url, ajaxSettings);
        crisis.ajax.poll(url, ajaxSetings, frequency);
    });
};

/**
 * @param {string} url
 * @param {Object} ajaxSettings
 * @param {number} frequency
 */
crisis.ajax.pollNow = function(url, ajaxSettings, frequency) {
    $.ajax(url, ajaxSettings);
    crisis.ajax.poll(url, ajaxSetings, frequency);
}
