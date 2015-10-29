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

    /** @override */
    this.divisionChanged = function() {
        crisis.map.position(thisMarker.$marker, div.absCoords);
        thisMarker.color();
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

    this.color = function() {
        /** @type {Array<number>} */
        var arr = crisis.factions.keys();
        arr.sort();
        /** @type {number} */
        var i = _.find(arr, function(id) { return id === div.factionId; });
        thisMarker.$marker.css('color', crisis.DivisionMapMarker.colors[i]);
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
