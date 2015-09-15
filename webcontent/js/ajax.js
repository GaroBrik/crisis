crisis.ajax = {};
crisis.ajax.path = "ajax/";
/** @export */
crisis.ajax.mapPath = crisis.ajax.path + "map/";
crisis.ajax.updateDivisionPath = crisis.ajax.path + "updateDivision/";

/**
 * @param{string} path,
 * @param{Object} data,
 * @param{Object} options
 */
crisis.ajax.postData = function(path, data, options) {
    if (options === null || options === undefined) options = {};
    options.type = "POST";
    options.data = JSON.stringify(data);
    options.dataType = 'json';
    options.contentType = 'application/json; charset=utf-8';
    $.ajax(path);
}

/** @param{Array<crisisJson.Unit>} */
crisis.ajax.postDivisionUpdate = function(units, options) {
    crisis.ajax.postData(crisis.ajax.updateDivisionPath, units, options);
}
