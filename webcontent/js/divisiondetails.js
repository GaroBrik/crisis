/**
 * @constructor
 * @param {crisis.Division} div
 */
crisis.DivisionDetails = function(div) {
    /** @type {jQuery} */
    this.$pane = null;
    /** @type {jQuery} */
    this.$details = null;
    /** @type {jQuery} */
    this.$factionSpan = null;
    /** @type {jQuery} */
    this.$factionSelector = null;
    /** @type {jQuery} */
    this.$nameSpan = null;
    /** @type {jQuery} */
    this.$editNameField = null;
    /** @type {jQuery} */
    this.$unitList = null;
    /** @type {jQuery} */
    this.$editButton = null;
    /** @type {jQuery} */
    this.$addUnitButton = null;
    /** @type {jQuery} */
    this.$cancelButton = null;
    /** @type {jQuery} */
    this.$commitButton = null;
    /** @type {jQuery} */
    this.$closeButton = null;
    /** @type {jQuery} */
    this.$createButton = null;
    /** @type {jQuery} */
    this.$deleteButton = null;
    /** @type {jQuery} */
    this.$routePlotter = null;
    /** @type {jQuery} */
    this.$routeInvalidAlert = null;
    /** @type {jQuery} */
    this.$undoRouteButton = null;
    /** @type {jQuery} */
    this.$cancelRouteButton = null;
    /** @type {jQuery} */
    this.$commitRouteButton = null;
    /** @type {crisis.Division} */
    this.division = div;
    /** @type {boolean} */
    this.isOpen = false;
    /** @type {boolean} */
    this.unRendered = true;
    /** @type {boolean} */
    this.uninitialized = true;
    /** @type {crisis.DivisionDetails.State} */
    this.state = crisis.DivisionDetails.State.VIEWING;
    /** @type {Array<crisis.Unit>} */
    this.newUnits = [];
    /** @type {Array<crisis.Unit>} */
    this.removedUnits = [];
    /** @type {Array<crisis.RoutePoint>} */
    this.route = [];
};

crisis.DivisionDetails.prototype.init = function() {
    var dets = this;

    dets.$pane = crisis.cloneProto(crisis.$protoDivisionPane);
    dets.$closeButton = dets.$pane.find('.closeButton');

    dets.$details = dets.$pane.find('.details');
    dets.$detailsInvalidAlert = dets.$details.find('.detailsInvalidAlert');
    dets.$factionNameSpan = dets.$details.find('.factionNameSpan');
    dets.$factionSelector = dets.$details.find('.factionSelector');
    dets.$nameSpan = dets.$details.find('.divisionNameSpan');
    dets.$editNameField = dets.$details.find('.editNameField');
    dets.$unitList = dets.$details.find('ul');
    dets.$editButton = dets.$details.find('.editButton');
    dets.$routeButton = dets.$details.find('.routeButton');
    dets.$addUnitButton = dets.$details.find('.addUnitButton');
    dets.$cancelButton = dets.$details.find('.cancelButton');
    dets.$commitButton = dets.$details.find('.commitButton');
    dets.$createButton = dets.$details.find('.createButton');
    dets.$deleteButton = dets.$details.find('.deleteButton');

    dets.$editButton.on('click' + crisis.event.baseNameSpace, function() {
        dets.enableEdit();
    });
    dets.$routeButton.on('click' + crisis.event.baseNameSpace, function() {
        dets.enableRoute();
    });
    dets.$addUnitButton.on('click' + crisis.event.baseNameSpace,
                           function() {
                               dets.addUnit();
                           });
    dets.$commitButton.on('click' + crisis.event.baseNameSpace, function() {
        dets.commitEdit();
    });
    dets.$createButton.on('click' + crisis.event.baseNameSpace, function() {
        dets.commitCreate();
    });
    dets.$deleteButton.on('click' + crisis.event.baseNameSpace, function() {
        dets.commitDelete();
    });
    dets.$closeButton.on('click' + crisis.event.baseNameSpace, function() {
        dets.close();
    });

    dets.$routePlotter = dets.$pane.find('.routePlotter');
    dets.$routeInvalidAlert = dets.$routePlotter.find('.routeInvalidAlert');
    dets.$undoRouteButton = dets.$routePlotter.find('.undoRouteButton');
    dets.$cancelRouteButton = dets.$routePlotter.find('.cancelRouteButton');
    dets.$commitRouteButton = dets.$routePlotter.find('.commitRouteButton');

    dets.$undoRouteButton.on('click' + crisis.event.baseNameSpace, function() {
        dets.undoRoute();
    });
    dets.$cancelRouteButton.on('click' + crisis.event.baseNameSpace,
                               function() {
                                   dets.disableRoute();
                               });
    dets.$commitRouteButton.on('click' + crisis.event.baseNameSpace,
                               function() {
                                   dets.commitRoute();
                               });

    crisis.map.$holder.append(dets.$pane);
};

crisis.DivisionDetails.prototype.toggle = function() {
    if (this.isOpen) {
        this.close();
    } else {
        this.open();
    }
};

crisis.DivisionDetails.prototype.open = function() {
    var dets = this;

    if (dets.uninitialized) {
        dets.init();
        dets.uninitialized = false;
    }

    if (dets.unRendered) {
        dets.reRender();
        dets.unRendered = false;
    }
    crisis.map.positionDropdown(dets.$pane, dets.division.$marker);

    dets.$pane.show();
    dets.isOpen = true;
};

crisis.DivisionDetails.prototype.close = function() {
    this.$pane.hide();
    this.isOpen = false;
};

crisis.DivisionDetails.prototype.reRender = function() {
    var dets = this;

    dets.$nameSpan.text(dets.division.name);
    dets.$factionNameSpan.html(crisis.factionHtml(dets.division.factionId));

    _.each(dets.division.units.concat(dets.newUnits), function(unit) {
        unit.$listItem.detach();
    });
    dets.$unitList.empty();
    _.each(dets.division.units.concat(dets.newUnits), function(unit) {
        dets.$unitList.append(unit.$listItem);
    });
};

crisis.DivisionDetails.prototype.enableEdit = function() {
    var dets = this;

    dets.$cancelButton.off('click' + crisis.event.baseNameSpace);
    dets.$cancelButton.on('click' + crisis.event.baseNameSpace, function() {
        dets.disableEdit();
    });

    dets.$editNameField.val(dets.division.name);
    dets.$factionSelector.val(dets.division.factionId.toString());

    dets.$factionNameSpan.hide();
    dets.$nameSpan.hide();
    dets.$editButton.hide();
    dets.$routeButton.hide();

    dets.$factionSelector.show();
    dets.$editNameField.show();
    dets.$cancelButton.show();
    dets.$commitButton.show();
    dets.$deleteButton.show();
    dets.$addUnitButton.show();

    _.each(dets.division.units, function(unit) {
        unit.enableEdit();
    });

    dets.state = crisis.DivisionDetails.State.EDITING;
};

crisis.DivisionDetails.prototype.enableCreate = function() {
    var dets = this;

    dets.$cancelButton.off('click' + crisis.event.baseNameSpace);
    dets.$cancelButton.on('click' + crisis.event.baseNameSpace, function() {
        dets.disableCreate();
    });

    dets.$editNameField.val(dets.division.name);

    dets.$factionNameSpan.hide();
    dets.$nameSpan.hide();
    dets.$editButton.hide();
    dets.$routeButton.hide();

    dets.$factionSelector.show();
    dets.$editNameField.show();
    dets.$cancelButton.show();
    dets.$createButton.show();
    dets.$addUnitButton.show();

    _.each(dets.division.units, function(unit) {
        unit.enableEdit();
    });

    dets.state = crisis.DivisionDetails.State.CREATING;
};

crisis.DivisionDetails.prototype.enableRoute = function() {
    var dets = this;

    dets.$details.hide();
    dets.$routePlotter.show();

    dets.route = [];

    /** @param {crisis.Coords} coords */
    var clickCallback = function(coords) {
        dets.route.push(new crisis.RoutePoint(coords));
        crisis.map.getClick(clickCallback);
    };

    crisis.map.getClick(clickCallback);

    dets.state = crisis.DivisionDetails.State.ROUTING;
};

crisis.DivisionDetails.prototype.disableEdit = function() {
    var dets = this;

    dets.$factionSelector.hide();
    dets.$editNameField.hide();
    dets.$cancelButton.hide();
    dets.$commitButton.hide();
    dets.$deleteButton.hide();
    dets.$addUnitButton.hide();

    dets.$factionNameSpan.show();
    dets.$nameSpan.show();
    dets.$editButton.show();
    dets.$routeButton.show();

    dets.$detailsInvalidAlert.hide();
    _.each(dets.newUnits, function(unit) { unit.destroy(); });
    _.each(dets.division.units, function(unit) { unit.disableEdit(); });
    _.each(dets.removedUnits, function(unit) { unit.$listItem.show(); });

    dets.state = crisis.DivisionDetails.State.VIEWING;
};

crisis.DivisionDetails.prototype.disableCreate = function() {
    this.division.destroy();
};

crisis.DivisionDetails.prototype.disableRoute = function() {
    var dets = this;

    dets.$routePlotter.hide();
    dets.$details.show();

    crisis.map.stopGettingClick();
    _.each(dets.route, function(routePoint) { routePoint.destroy(); });

    dets.state = crisis.DivisionDetails.State.VIEWING;
};

crisis.DivisionDetails.prototype.undoRoute = function() {
    var dets = this;

    if (dets.route.length > 0) {
        dets.route[dets.route.length - 1].destroy();
        dets.route = dets.route.slice(0, dets.route.length - 1);
    }
};

crisis.DivisionDetails.prototype.addUnit = function() {
    var dets = this;

    if (dets.state !== crisis.DivisionDetails.State.EDITING &&
        dets.state !== crisis.DivisionDetails.State.CREATING)
    {
        return;
    }

    var currentIds = /** @type {Array<number>} */
        (_.map(dets.division.units.concat(dets.newUnits), function(unit) {
            return unit.type;
        }));

    crisis.map.showUnitTypeFinder(currentIds, dets.$pane,
        function(num) {
            if (num === null) return;
            var newUnit = new crisis.Unit({
                Type: num,
                Amount: 0
            }, dets.division);
            newUnit.enableEdit();
            dets.newUnits.push(newUnit);
            dets.$unitList.append(newUnit.$listItem);
        });
};

/** @param {crisis.Unit} unit */
crisis.DivisionDetails.prototype.removeUnit = function(unit) {
    var dets = this;

    if (_.contains(dets.newUnits, unit)) {
        dets.newUnits = _.without(dets.newUnits, unit);
        unit.destroy();
    } else {
        dets.removedUnits.push(unit);
        unit.$listItem.hide();
    }
};

crisis.DivisionDetails.prototype.commitEdit = function() {
    var dets = this;

    if (dets.state !== crisis.DivisionDetails.State.EDITING) return;

    /** @type {Array<crisisJson.Unit>} */
    var newUnits = [];
    var validSubmit = true;
    _.each(dets.division.units.concat(dets.newUnits), function(unit) {
        if (_.contains(dets.removedUnits, unit)) return;

        /** @type {number} */
        var newVal = parseInt(unit.$editField.val(), 10);
        if (isNaN(newVal)) {
            unit.$invalidAlert.show();
            dets.$detailsInvalidAlert.show();
            validSubmit = false;
        } else {
            newUnits.push({Type: unit.type, Amount: newVal});
        }
    });


    var name = /** @type {string?} */(dets.$editNameField.val());
    if (name === dets.division.name) name = null;

    var factionId = /** @type {number?} */ (crisis.stringToInt(
        /** @type {string} */ (dets.$factionSelector.val())));
    if (factionId === dets.division.factionId) factionId = null;

    if (!validSubmit) return;
    crisis.ajax.postDivisionUpdate(dets.division.id, newUnits, name, factionId,
        {
            /** @param {crisisJson.Division} divData */
            success: function(divData) {
                _.each(dets.newUnits, function(unit) { unit.destroy(); });
                dets.newUnits = [];
                dets.division.update(divData);
                dets.disableEdit();
            }
        });
};

crisis.DivisionDetails.prototype.commitCreate = function() {
    var dets = this;

    if (dets.state !== crisis.DivisionDetails.State.CREATING) return;

    /** @type {Array<crisisJson.Unit>} */
    var newUnits = [];
    var validSubmit = true;
    _.each(dets.division.units.concat(dets.newUnits), function(unit) {
        if (_.contains(dets.removedUnits, unit)) return;

        /** @type {number} */
        var newVal = parseInt(unit.$editField.val(), 10);
        if (isNaN(newVal)) {
            unit.$invalidAlert.show();
            dets.$detailsInvalidAlert.show();
            validSubmit = false;
        } else {
            newUnits.push({Type: unit.type, Amount: newVal});
        }
    });

    var name = /** @type {string} */(dets.$editNameField.val());
    if (name === '') {
        dets.$detailsInvalidAlert.show();
        validSubmit = false;
    }

    var factionId = /** @type {number} */ (crisis.stringToInt(
        /** @type {string} */ (dets.$factionSelector.val())));

    if (!validSubmit) return;
    crisis.ajax.postDivisionCreation(
        dets.division.absCoords, newUnits, name, factionId, {
            success: function(divJson) {
                dets.division.destroy();
                crisis.map.addDivision(divJson);
            }
        });
};

crisis.DivisionDetails.prototype.commitRoute = function() {
    var dets = this;

    if (dets.state !== crisis.DivisionDetails.State.ROUTING) return;

    /** @type {Array<crisisJson.Coords>} */
    var route = /** @type {Array<crisisJson.Coords>} */
        (_.map(dets.route, function(routePoint) {
            return routePoint.coords.toJson();
        }));

    crisis.ajax.postDivisionRoute(dets.division.id, route, {
        success: function(result) {
            if (result.Success) {
                dets.disableRoute();
            } else {
                dets.$routeInvalidAlert.show();
            }
        }
    })
};

crisis.DivisionDetails.prototype.commitDelete = function() {
    var dets = this;

    crisis.ajax.postDivisionDeletion(dets.division.id, {
        success: function() {
            dets.division.destroy();
        }
    });
};

/** @enum {string} */
crisis.DivisionDetails.State = {
    VIEWING: 'VIEWING',
    EDITING: 'EDITING',
    CREATING: 'CREATING',
    ROUTING: 'ROUTING'
}
