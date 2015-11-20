/**
 * @constructor
 * @param {crisisJson.Unit} unitJson
 * @param {crisis.Division} div
 * @implements {crisis.Updateable<crisisJson.Unit>}
 * @implements {crisis.UnitType.ChangeListener}
 */
crisis.Unit = function(unitJson, div) {
    /** @type {crisis.Division} */
    this.division = div;
    /** @type {number} */
    this.amount = unitJson.Amount;
    /** @type {number} */
    this.type = unitJson.Type;
    /** @type {buckets.Set<crisis.Unit.ChangeListener> }*/
    this.listeners = new buckets.Set(function(l) { return l.listenerId(); });
    /** @type {crisis.DetailsUnitLi} */
    this.detailsLi = crisis.DetailsUnitLi.fromUnit(this);
};

/** @interface */
crisis.Unit.ChangeListener = function() {};
/** @param {crisis.Unit} unit */
crisis.Unit.ChangeListener.prototype.unitChanged = function(unit) {};
crisis.Unit.ChangeListener.prototype.unitDestroyed = function() {};
/** @return {string} */
crisis.Unit.ChangeListener.prototype.listenerId = function() {};

/**
 * @override
 * @param {crisisJson.Unit} json
 */
crisis.Unit.prototype.update = function(json) {
    /** @type {crisis.Unit} */
    var thisUnit = this;

    if (this.amount !== json.Amount) {
        this.amount = json.Amount;
        this.listeners.forEach(function(listener) {
            listener.unitChanged(thisUnit);
        });
    }
};

crisis.Unit.prototype.destroy = function() {
    this.division.removeUnit(this);
    this.listeners.forEach(function(listener) {
        listener.unitDestroyed();
    });
};

/** @override */
crisis.Unit.prototype.unitTypeChanged = function() {};

crisis.Unit.prototype.unitTypeDestroyed = function() {
    this.destroy();
};

crisis.Unit.prototype.listenerId = function() {
    return 'division(' + this.division.id + ')';
};
