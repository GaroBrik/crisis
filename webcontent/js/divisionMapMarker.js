/**
 * @constructor
 * @param {crisis.Division} div
 * @implements {crisis.Division.ChangeListener}
 * @implements {crisis.Faction.ChangeListener}
 */
crisis.DivisionMapMarker = function(div) {
    /** @type {crisis.DivisionMapMarker} */
    var thisMarker = this;

    /** @type {jQuery} */
    this.$marker = crisis.cloneProto(crisis.prototypes.$divisionMarker);

    /** @override */
    this.divisionChanged = function(newDiv) {
        crisis.map.position(thisMarker.$marker, newDiv.absCoords);
        thisMarker.color();
    };

    /** @override */
    this.divisionDestroyed = function() {
        thisMarker.destroy();
    };

    /** @override */
    this.factionChanged = function(faction) {
        thisMarker.color();
    };

    /** @override */
    this.factionDestroyed = _.noop;

    /**
     * @override
     * @return {string}
     */
    this.listenerId = function() {
        return 'divisionMapMarker(' + div.id + ')';
    };

    this.destroy = function() {
        thisMarker.$marker.remove();
        div.listeners.remove(thisMarker);
        crisis.getFaction(div.factionId).listeners.remove(thisMarker);
    };

    this.color = function() {
        thisMarker.$marker.css('color', crisis.getFaction(div.factionId).color);
    };

    this.$marker.click(function() { div.details.toggle(); });
    crisis.map.add(this.$marker);
    div.listeners.add(this);
    crisis.getFaction(div.factionId).listeners.add(this);
};
