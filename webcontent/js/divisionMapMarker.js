/**
 * @constructor
 * @param {crisis.Division} div
 * @implements {crisis.Division.ChangeListener}
 */
crisis.DivisionMapMarker = function(div) {
    /** @type {jQuery} */
    this.$marker = crisis.cloneProto(crisis.prototypes.$divisionMarker);

    /** @override */
    this.divisionChanged = function() {
        crisis.map.position(this.$marker, div.absCoords);
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
        this.$marker.remove();
    };

    this.$marker.click(function() { div.details.toggle(); });
    crisis.map.add(this.$marker);
    div.listeners.add(this);
};
