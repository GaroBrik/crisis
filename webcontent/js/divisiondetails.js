/**
 * @constructor
 * @param {crisis.Division} division
 * @param {boolean} forCreation
 * @implements {crisis.Division.ChangeListener}
 * @implements {crisis.Faction.ChangeListener}
 */
crisis.DivisionDetails = function(division, forCreation) {
    /** @type {boolean} */
    this.forCreation = forCreation;
    
    /** @type {jQuery} */
    this.$pane = null;
    /** @type {jQuery} */
    this.$details = null;
    /** @type {jQuery} */
    this.$factionSpan = null;
    /** @type {crisis.FactionSelector} */
    this.factionSelector = null;
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
    /** @type {boolean} */
    this.isOpen = false;
    /** @type {boolean} */
    this.updateFaction = true;
    /** @type {boolean} */
    this.updateDivision = true;
    /** @type {boolean} */
    this.uninitialized = true;
    /** @type {crisis.DivisionDetails.State} */
    this.state = crisis.DivisionDetails.State.VIEWING;
    /** @type {Array<crisis.DetailsUnitLi>} */
    this.newUnits = [];
    /** @type {Array<crisis.DetailsUnitLi>} */
    this.removedUnits = [];
    /** @type {Array<crisis.RoutePoint>} */
    this.route = [];

    this.init = function() {
        var dets = this;

        dets.$pane = crisis.cloneProto(crisis.prototypes.$divisionPane);
        dets.$closeButton = dets.$pane.find('.closeButton');

        dets.$details = dets.$pane.find('.details');
        dets.$detailsInvalidAlert = dets.$details.find('.detailsInvalidAlert');
        dets.$factionNameSpan = dets.$details.find('.factionNameSpan');
        dets.factionSelector = new crisis.FactionSelector(
            'factionSelectorForDivDets(' + division.id + ')');
        dets.$details.find('.factionSelectorPlace').replaceWith(
            dets.factionSelector.$selector);
        dets.$nameSpan = dets.$details.find('.divisionNameSpan');
        dets.$editNameField = dets.$details.find('.editNameField');
        dets.$unitList = dets.$details.find('ul');
        dets.$editButton = dets.$details.find('.editButton');
        dets.$routeButton = dets.$details.find('.routeButton');
        dets.$addUnitButton = dets.$details.find('.addUnitButton');
        dets.$cancelButton = dets.$details.find('.cancelButton');
        dets.$commitButton = dets.$details.find('.commitButton');
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
        dets.$cancelButton.on('click' + crisis.event.baseNameSpace, function() {
            if (dets.forCreation) {
                dets.destroy();
            } else {
                dets.disableEdit();
            }
        });
        dets.$commitButton.on('click' + crisis.event.baseNameSpace, function() {
            if (dets.forCreation) {
                dets.commitCreate();
            } else {
                dets.commitEdit();
            }
        });
        dets.$deleteButton.on('click' + crisis.event.baseNameSpace, function() {
            dets.commitDelete();
        });
        dets.$closeButton.on('click' + crisis.event.baseNameSpace, function() {
            if (dets.forCreation) {
                dets.destroy();
            } else {
                dets.close();
            }
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

        if (this.forCreation) return;

        division.units.forEach(function(typeId, unit) {
            dets.$unitList.append(unit.detailsLi.$listItem);
        });
        crisis.getFaction(division.factionId).listeners.add(this);
        division.listeners.add(this);
    };

    this.toggle = function() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    };

    this.open = function() {
        if (this.uninitialized) {
            this.init();
            this.uninitialized = false;
        }

        this.reRender();

        this.$pane.show();
        this.isOpen = true;
    };

    this.close = function() {
        this.$pane.hide();
        this.isOpen = false;
    };

    this.reRender = function() {
        var thisDets = this;
        
        if (this.forCreation) {
            this.$pane.css({
                'left': '0',
                'top': '0'
            });
            return;
        }
        
        if (this.updateFaction) {
            this.$factionNameSpan.text(
                crisis.getFaction(division.factionId).name);
            
            this.updateFaction = false;
        }
        
        if (this.updateDivision) {
            this.$nameSpan.text(division.name);
            
            _.each(division.units.values().concat(this.newUnits), function(u) {
                u.$listItem.detach();
            });
            this.$unitList.empty();
            _.each(division.units.values().concat(this.newUnits), function(u) {
                thisDets.$unitList.append(u.$listItem);
            });
            
            this.updateDivision = false;
        }
        
        crisis.map.positionDropdown(
            this.$pane, division.mapMarker.$marker);
    };

    /**
     * @override
     * @param {crisis.Faction} faction
     */
    this.factionChanged = function(faction) {
        this.updateFaction = true;
        if (this.isOpen) {
            this.reRender();
        }
    };

    /** @override */
    this.factionDestroyed = _.noop;
    
    /**
     * @override
     * @param {crisis.Division} division
     */
    this.divisionChanged = function(division) {
        this.updateDivision = true;
        if (this.isOpen) {
            this.reRender();
        }
    };

    /** @override */
    this.divisionDestroyed = function() {
        this.$pane.remove();
    };

    /**
     * @override
     * @return {string}
     */
    this.listenerId = function() {
        return 'divDets(' + division.id + ')';
    };

    this.enableEdit = function() {
        var dets = this;

        if (!this.forCreation) {
            dets.$editNameField.val(division.name);
            dets.factionSelector.setSelectedFaction(division.factionId);
        }

        dets.$factionNameSpan.hide();
        dets.$nameSpan.hide();
        dets.$editButton.hide();
        dets.$routeButton.hide();

        dets.factionSelector.$selector.show();
        dets.$editNameField.show();
        dets.$cancelButton.show();
        dets.$commitButton.show();
        dets.$deleteButton.show();
        dets.$addUnitButton.show();

        if (!this.forCreation) {
            division.units.forEach(function(k, unit) {
                unit.detailsLi.enableEdit();
            });
        }

        dets.state = crisis.DivisionDetails.State.EDITING;
    };

    this.enableRoute = function() {
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

    this.disableEdit = function() {
        var dets = this;

        dets.factionSelector.$selector.hide();
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
        division.units.forEach(function(k, unit) {
            unit.detailsLi.disableEdit();
        });
        _.each(dets.removedUnits, function(unit) {
            unit.$listItem.show();
        });

        dets.state = crisis.DivisionDetails.State.VIEWING;
    };

    this.disableRoute = function() {
        var dets = this;

        dets.$routePlotter.hide();
        dets.$details.show();

        crisis.map.stopGettingClick();
        _.each(dets.route, function(routePoint) { routePoint.destroy(); });

        dets.state = crisis.DivisionDetails.State.VIEWING;
    };

    this.undoRoute = function() {
        var dets = this;

        if (dets.route.length > 0) {
            dets.route[dets.route.length - 1].destroy();
            dets.route = dets.route.slice(0, dets.route.length - 1);
        }
    };

    this.addUnit = function() {
        var dets = this;

        if (dets.state !== crisis.DivisionDetails.State.EDITING &&
            dets.state !== crisis.DivisionDetails.State.CREATING)
        {
            return;
        }

        var toLoop = this.forCreation ? dets.newUnits :
            division.units.values().concat(dets.newUnits);
        var currentIds = /** @type {Array<number>} */
            (_.map(toLoop, function(unit) { return unit.type; }));

        crisis.map.showUnitTypeFinder(currentIds, dets.$pane,
            function(num) {
                if (num === null) return;
                var newUnit = crisis.DetailsUnitLi.forCreation(dets, num);
                dets.newUnits.push(newUnit);
            });
    };

    /** @param {crisis.DetailsUnitLi} unit */
    this.removeUnitLi = function(unit) {
        var dets = this;

        if (_.contains(dets.newUnits, unit)) {
            dets.newUnits = _.without(dets.newUnits, unit);
            unit.destroy();
        } else {
            dets.removedUnits.push(unit);
            unit.$listItem.hide();
        }
    };

    this.commitEdit = function() {
        var dets = this;

        if (dets.state !== crisis.DivisionDetails.State.EDITING) return;

        /** @type {Array<crisisJson.Unit>} */
        var newUnits = [];
        var validSubmit = true;
        _.each(division.units.values().concat(dets.newUnits), function(unit) {
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
        if (name === division.name) name = null;

        var factionId = dets.factionSelector.getSelectedFaction();
        if (factionId === division.factionId) factionId = null;

        if (!validSubmit) return;
        crisis.ajax.postDivisionUpdate(
            division.id, newUnits, name, factionId,
            {
                /** @param {crisisJson.Division} divData */
                success: function(divData) {
                    _.each(dets.newUnits, function(unit) { unit.destroy(); });
                    dets.newUnits = [];
                    division.update(divData);
                    dets.disableEdit();
                }
            });
    };

    this.commitCreate = function() {
        var dets = this;

        if (dets.state !== crisis.DivisionDetails.State.CREATING) return;

        /** @type {Array<crisisJson.Unit>} */
        var newUnits = [];
        var validSubmit = true;
        _.each(dets.newUnits, function(unit) {
            if (_.contains(dets.removedUnits, unit)) return;

            /** @type {number} */
            var newVal = parseInt(unit.$editField.val(), 10);
            if (isNaN(newVal)) {
                unit.$invalidAlert.show();
                dets.$detailsInvalidAlert.show();
                validSubmit = false;
            } else {
                newUnits.push({Type: unit.typeId, Amount: newVal});
            }
        });

        var name = /** @type {string} */(dets.$editNameField.val());
        if (name === '') {
            dets.$detailsInvalidAlert.show();
            validSubmit = false;
        }

        /** @type {number} */
        var factionId = dets.factionSelector.getSelectedFaction();

        if (!validSubmit) return;
        crisis.ajax.postDivisionCreation(
            division.absCoords, newUnits, name, factionId, {
                success: function(divJson) {
                    dets.destroy();
                    crisis.addDivision(new crisis.Division(divJson));
                }
            });
    };

    this.commitRoute = function() {
        var dets = this;

        if (dets.state !== crisis.DivisionDetails.State.ROUTING) return;

        /** @type {Array<crisisJson.Coords>} */
        var route = /** @type {Array<crisisJson.Coords>} */
            (_.map(dets.route, function(routePoint) {
                return routePoint.coords.toJson();
            }));

        crisis.ajax.postDivisionRoute(division.id, route, {
            success: function(result) {
                if (result.Success) {
                    dets.disableRoute();
                } else {
                    dets.$routeInvalidAlert.show();
                }
            }
        })
    };

    this.commitDelete = function() {
        var dets = this;

        crisis.ajax.postDivisionDeletion(division.id, {
            success: function() {
                division.destroy();
            }
        });
    };

    this.destroy = function() {
        this.$pane.remove();
        if (!this.forCreation) {
            crisis.factions.get(division.factionId).listeners.remove(this);
            division.listeners.remove(this);
        }
    };
    
    if (this.forCreation) {
        this.enableEdit();
    }
};

/** @param {crisis.Division} div */
crisis.DivisionDetails.fromDivision = function(div) {
    return new crisis.DivisionDetails(div, false);
};

crisis.DivisionDetails.forCreation = function() {
    return new crisis.DivisionDetails(null, true);
};

/** @enum {string} */
crisis.DivisionDetails.State = {
    VIEWING: 'VIEWING',
    EDITING: 'EDITING',
    CREATING: 'CREATING',
    ROUTING: 'ROUTING'
};
