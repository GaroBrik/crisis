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
    this.$backupIcon = this.$marker.find('.backup-icon');
    this.$icon = this.$marker.find('.icon');

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
        thisMarker.$marker.find('.backup-icon')
            .css('color', crisis.getFaction(div.factionId).color);
    };

    this.$icon.error(function() {
        thisMarker.$icon.hide();
        thisMarker.$backupIcon.show();
    });
    this.$icon.attr('src', 'static/bgs/d1-' + div.id +
                    '.png?' + (new Date).getTime());
    this.$marker.click(function() { div.details.toggle(); });
    crisis.map.add(this.$marker);
    div.listeners.add(this);
    crisis.getFaction(div.factionId).listeners.add(this);
};
