/**
 * @constructor
 * @param {crisis.Division} div
 * @implements {crisis.Division.ChangeListener}
 */
crisis.DivisionMapMarker = function(div) {
    /** @type {crisis.DivisionMapMarker} */
    var thisMarker = this;

    /** @type {jQuery} */
    this.$marker = crisis.cloneProto(crisis.prototypes.$divisionMarker);
    /** @type {Array<number>} */
    var arr = crisis.divisions.keys();
    arr.sort();
    console.log(arr);
    /** @type {number} */
    var i = _.find(arr, function(id) { return id === div.id; });
    console.log(i, crisis.DivisionMapMarker.colors[i]);
    this.$marker.css('color', crisis.DivisionMapMarker.colors[i]);

    /** @override */
    this.divisionChanged = function() {
        crisis.map.position(thisMarker.$marker, div.absCoords);
    };

    /**
     * @override
     * @return {string}
     */
    this.listenerId = function() {
        return 'divisionMapMarker(' + div.id + ')';
    };

    /** @override */
    this.divisionDestroyed = function() {
        thisMarker.$marker.remove();
    };

    this.$marker.click(function() { div.details.toggle(); });
    crisis.map.add(this.$marker);
    div.listeners.add(this);
};

/** @type {Array<string>} */
crisis.DivisionMapMarker.colors = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#000000',
    '#ffff00',
    '#ff00ff',
    '#00ffff',
    '#ffffff'];
