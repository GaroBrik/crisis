/**
 * @constructor
 * @param {crisis.Division} division
 * @param {boolean} forCreation
 * @implements {crisis.Division.ChangeListener}
 * @implements {crisis.Faction.ChangeListener}
 */
crisis.DivisionDetails = function(division, forCreation) {
    /** @type {crisis.DivisionDetails} */
    var thisDets = this;

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
        thisDets.$pane = crisis.cloneProto(crisis.prototypes.$divisionPane);
        thisDets.$closeButton = thisDets.$pane.find('.closeButton');

        thisDets.$details = thisDets.$pane.find('.details');
        thisDets.$detailsInvalidAlert =
            thisDets.$details.find('.detailsInvalidAlert');
        thisDets.$factionNameSpan = thisDets.$details.find('.factionNameSpan');
        thisDets.factionSelector = new crisis.FactionSelector(
            'factionSelectorForDivDets(' + division.id + ')');
        thisDets.$details.find('.factionSelectorPlace').replaceWith(
            thisDets.factionSelector.$selector);
        thisDets.$nameSpan = thisDets.$details.find('.divisionNameSpan');
        thisDets.$editNameField = thisDets.$details.find('.editNameField');
        thisDets.$unitList = thisDets.$details.find('ul');
        thisDets.$editButton = thisDets.$details.find('.editButton');
        thisDets.$routeButton = thisDets.$details.find('.routeButton');
        thisDets.$addUnitButton = thisDets.$details.find('.addUnitButton');
        thisDets.$cancelButton = thisDets.$details.find('.cancelButton');
        thisDets.$commitButton = thisDets.$details.find('.commitButton');
        thisDets.$deleteButton = thisDets.$details.find('.deleteButton');

        thisDets.$editButton.on('click' + crisis.event.baseNameSpace,
                                function() {
                                    thisDets.enableEdit();
                                });
        thisDets.$routeButton.on('click' + crisis.event.baseNameSpace,
                                 function() {
                                     thisDets.enableRoute();
                                 });
        thisDets.$addUnitButton.on('click' + crisis.event.baseNameSpace,
                               function() {
                                   thisDets.addUnit();
                               });
        thisDets.$cancelButton.on('click' + crisis.event.baseNameSpace,
                                  function() {
                                      if (thisDets.forCreation) {
                                          thisDets.destroy();
                                      } else {
                                          thisDets.disableEdit();
                                      }
                                  });
        thisDets.$commitButton.on('click' + crisis.event.baseNameSpace,
                                  function() {
                                      if (thisDets.forCreation) {
                                          thisDets.commitCreate();
                                      } else {
                                          thisDets.commitEdit();
                                      }
                                  });
        thisDets.$deleteButton.on('click' + crisis.event.baseNameSpace,
                                  function() {
                                      thisDets.commitDelete();
                                  });
        thisDets.$closeButton.on('click' + crisis.event.baseNameSpace,
                                 function() {
                                     if (thisDets.forCreation) {
                                         thisDets.destroy();
                                     } else {
                                         thisDets.close();
                                     }
                                 });

        thisDets.$routePlotter = thisDets.$pane.find('.routePlotter');
        thisDets.$routeInvalidAlert =
            thisDets.$routePlotter.find('.routeInvalidAlert');
        thisDets.$undoRouteButton =
            thisDets.$routePlotter.find('.undoRouteButton');
        thisDets.$cancelRouteButton =
            thisDets.$routePlotter.find('.cancelRouteButton');
        thisDets.$commitRouteButton =
            thisDets.$routePlotter.find('.commitRouteButton');

        thisDets.$undoRouteButton.on('click' + crisis.event.baseNameSpace,
                                 function() {
                                     thisDets.undoRoute();
                                 });
        thisDets.$cancelRouteButton.on('click' + crisis.event.baseNameSpace,
                                   function() {
                                       thisDets.disableRoute();
                                   });
        thisDets.$commitRouteButton.on('click' + crisis.event.baseNameSpace,
                                   function() {
                                       thisDets.commitRoute();
                                   });

        crisis.map.$holder.append(thisDets.$pane);

        if (thisDets.forCreation) return;

        division.units.forEach(function(typeId, unit) {
            thisDets.$unitList.append(unit.detailsLi.$listItem);
        });
        crisis.getFaction(division.factionId).listeners.add(thisDets);
        division.listeners.add(thisDets);
    };

    this.toggle = function() {
        if (thisDets.isOpen) {
            thisDets.close();
        } else {
            thisDets.open();
        }
    };

    this.open = function() {
        if (thisDets.uninitialized) {
            thisDets.init();
            thisDets.uninitialized = false;
        }

        thisDets.reRender();

        thisDets.$pane.show();
        thisDets.isOpen = true;
    };

    this.close = function() {
        thisDets.$pane.hide();
        thisDets.isOpen = false;
    };

    this.reRender = function() {
        if (thisDets.forCreation) {
            thisDets.$pane.css({
                'left': '0',
                'top': '0'
            });
            return;
        }

        if (thisDets.updateFaction) {
            thisDets.$factionNameSpan.text(
                crisis.getFaction(division.factionId).name);

            thisDets.updateFaction = false;
        }

        if (thisDets.updateDivision) {
            thisDets.$nameSpan.text(division.name);

            _.each(thisDets.currentUnitLis(), function(u) {
                u.$listItem.detach();
            });
            thisDets.$unitList.empty();
            _.each(thisDets.currentUnitLis(), function(u) {
                thisDets.$unitList.append(u.$listItem);
            });

            thisDets.updateDivision = false;
        }

        crisis.map.positionDropdown(
            thisDets.$pane, division.mapMarker.$marker);
    };

    /** @return {Array<crisis.DetailsUnitLi>} */
    this.currentUnitLis = function() {
        /** @type {Array<crisis.DetailsUnitLi>} */
        var currentUnitLis = [];
        if (!thisDets.forCreation) {
            currentUnitLis = _.map(division.units.values(), function(unit) {
                return unit.detailsLi;
            });
        }
        return currentUnitLis.concat(thisDets.newUnits);
    };

    /**
     * @override
     * @param {crisis.Faction} faction
     */
    this.factionChanged = function(faction) {
        thisDets.updateFaction = true;
        if (thisDets.isOpen) {
            thisDets.reRender();
        }
    };

    /** @override */
    this.factionDestroyed = _.noop;

    /**
     * @override
     * @param {crisis.Division} division
     */
    this.divisionChanged = function(division) {
        thisDets.updateDivision = true;
        thisDets.updateFaction = true;
        if (thisDets.isOpen) {
            thisDets.reRender();
        }
    };

    /** @override */
    this.divisionDestroyed = function() {
        thisDets.$pane.remove();
    };

    /**
     * @override
     * @return {string}
     */
    this.listenerId = function() {
        return 'divDets(' + division.id + ')';
    };

    this.enableEdit = function() {
        if (!thisDets.forCreation) {
            thisDets.$editNameField.val(division.name);
            thisDets.factionSelector.setSelectedFaction(division.factionId);
        }

        thisDets.$factionNameSpan.hide();
        thisDets.$nameSpan.hide();
        thisDets.$editButton.hide();
        thisDets.$routeButton.hide();

        thisDets.factionSelector.$selector.show();
        thisDets.$editNameField.show();
        thisDets.$cancelButton.show();
        thisDets.$commitButton.show();
        thisDets.$deleteButton.show();
        thisDets.$addUnitButton.show();

        if (!thisDets.forCreation) {
            division.units.forEach(function(k, unit) {
                unit.detailsLi.enableEdit();
            });
        }

        thisDets.state = crisis.DivisionDetails.State.EDITING;
    };

    this.enableRoute = function() {
        thisDets.$details.hide();
        thisDets.$routePlotter.show();

        thisDets.route = [];

        /** @param {crisis.Coords} coords */
        var clickCallback = function(coords) {
            thisDets.route.push(new crisis.RoutePoint(coords));
            crisis.map.getClick(clickCallback);
        };

        crisis.map.getClick(clickCallback);

        thisDets.state = crisis.DivisionDetails.State.ROUTING;
    };

    this.disableEdit = function() {
        thisDets.factionSelector.$selector.hide();
        thisDets.$editNameField.hide();
        thisDets.$cancelButton.hide();
        thisDets.$commitButton.hide();
        thisDets.$deleteButton.hide();
        thisDets.$addUnitButton.hide();

        thisDets.$factionNameSpan.show();
        thisDets.$nameSpan.show();
        thisDets.$editButton.show();
        thisDets.$routeButton.show();

        thisDets.$detailsInvalidAlert.hide();
        _.each(thisDets.newUnits, function(unit) { unit.destroy(); });
        division.units.forEach(function(k, unit) {
            unit.detailsLi.disableEdit();
        });
        _.each(thisDets.removedUnits, function(unit) {
            unit.$listItem.show();
        });

        thisDets.state = crisis.DivisionDetails.State.VIEWING;
    };

    this.disableRoute = function() {
        thisDets.$routePlotter.hide();
        thisDets.$details.show();

        crisis.map.stopGettingClick();
        _.each(thisDets.route, function(routePoint) { routePoint.destroy(); });

        thisDets.state = crisis.DivisionDetails.State.VIEWING;
    };

    this.undoRoute = function() {
        if (thisDets.route.length > 0) {
            thisDets.route[thisDets.route.length - 1].destroy();
            thisDets.route = thisDets.route.slice(0, thisDets.route.length - 1);
        }
    };

    this.addUnit = function() {
        if (thisDets.state !== crisis.DivisionDetails.State.EDITING &&
            thisDets.state !== crisis.DivisionDetails.State.CREATING)
        {
            return;
        }

        /** @type {Array<number>} */
        var currentIds = _.map(this.currentUnitLis(),
                               function(unit) { return unit.typeId; });

        /** @type {crisis.UnitTypeChooser} */
        var chooser = new crisis.UnitTypeChooser(
            'divDetsTypeChooser(' + division.id + ')',
            function(num) {
                if (num === null) return;
                /** @type {crisis.DetailsUnitLi} */
                var newUnit = crisis.DetailsUnitLi.forCreation(thisDets, num);
                thisDets.newUnits.push(newUnit);
                thisDets.$addUnitButton.show();
            });
        thisDets.$addUnitButton.hide();
        thisDets.$details.append(chooser.$chooser);
    };

    /** @param {crisis.DetailsUnitLi} unit */
    this.removeUnitLi = function(unit) {
        if (_.contains(thisDets.newUnits, unit)) {
            thisDets.newUnits = _.without(thisDets.newUnits, unit);
            unit.destroy();
        } else {
            thisDets.removedUnits.push(unit);
            unit.$listItem.hide();
        }
    };

    this.commitEdit = function() {
        if (thisDets.state !== crisis.DivisionDetails.State.EDITING) return;

        /** @type {Array<crisisJson.Unit>} */
        var newUnits = [];
        var validSubmit = true;
        _.each(this.currentUnitLis(), function(unit) {
            if (_.contains(thisDets.removedUnits, unit)) return;

            /** @type {number} */
            var newVal = parseInt(unit.$editField.val(), 10);
            if (isNaN(newVal)) {
                unit.$invalidAlert.show();
                thisDets.$detailsInvalidAlert.show();
                validSubmit = false;
            } else {
                newUnits.push({Type: unit.typeId, Amount: newVal});
            }
        });


        var name = /** @type {string?} */(thisDets.$editNameField.val());
        if (name === division.name) name = null;

        var factionId = thisDets.factionSelector.getSelectedFaction();
        if (factionId === division.factionId) factionId = null;

        if (!validSubmit) return;
        crisis.ajax.postDivisionUpdate(
            division.id, newUnits, name, factionId,
            {
                /** @param {crisisJson.Division} divData */
                success: function(divData) {
                    _.each(thisDets.newUnits, function(unit) {
                        unit.destroy();
                    });
                    thisDets.newUnits = [];
                    division.update(divData);
                    thisDets.disableEdit();
                }
            });
    };

    this.commitCreate = function() {
        if (thisDets.state !== crisis.DivisionDetails.State.CREATING) return;

        /** @type {Array<crisisJson.Unit>} */
        var newUnits = [];
        var validSubmit = true;
        _.each(thisDets.newUnits, function(unit) {
            if (_.contains(thisDets.removedUnits, unit)) return;

            /** @type {number} */
            var newVal = parseInt(unit.$editField.val(), 10);
            if (isNaN(newVal)) {
                unit.$invalidAlert.show();
                thisDets.$detailsInvalidAlert.show();
                validSubmit = false;
            } else {
                newUnits.push({Type: unit.typeId, Amount: newVal});
            }
        });

        var name = /** @type {string} */(thisDets.$editNameField.val());
        if (name === '') {
            thisDets.$detailsInvalidAlert.show();
            validSubmit = false;
        }

        /** @type {number} */
        var factionId = thisDets.factionSelector.getSelectedFaction();

        if (!validSubmit) return;
        crisis.ajax.postDivisionCreation(
            division.absCoords, newUnits, name, factionId, {
                success: function(divJson) {
                    thisDets.destroy();
                    crisis.addDivision(new crisis.Division(divJson));
                }
            });
    };

    this.commitRoute = function() {
        if (thisDets.state !== crisis.DivisionDetails.State.ROUTING) return;

        /** @type {Array<crisisJson.Coords>} */
        var route = /** @type {Array<crisisJson.Coords>} */
            (_.map(thisDets.route, function(routePoint) {
                return routePoint.coords.toJson();
            }));

        crisis.ajax.postDivisionRoute(division.id, route, {
            success: function(result) {
                if (result.Success) {
                    thisDets.disableRoute();
                } else {
                    thisDets.$routeInvalidAlert.show();
                }
            }
        })
    };

    this.commitDelete = function() {
        crisis.ajax.postDivisionDeletion(division.id, {
            success: function() {
                division.destroy();
            }
        });
    };

    this.destroy = function() {
        thisDets.$pane.remove();
        if (!thisDets.forCreation) {
            crisis.getFaction(division.factionId).listeners.remove(thisDets);
            division.listeners.remove(thisDets);
        }
    };

    if (this.forCreation) {
        this.open();
        this.enableEdit();
    }
};

/**
 * @param {crisis.Division} div
 * @return {crisis.DivisionDetails}
 */
crisis.DivisionDetails.fromDivision = function(div) {
    return new crisis.DivisionDetails(div, false);
};

/** @return {crisis.DivisionDetails} */
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
