/**
 * @constructor
 * @param {crisis.Division} div
 */
crisis.DivisionDetails = function(div) {
    /** @type {jQuery} */
    this.$pane = null;
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
    /** @type {crisis.Division} */
    this.division = div;
    /** @type {boolean} */
    this.isOpen = false;
    /** @type {boolean} */
    this.unRendered = true;
    /** @type {crisis.DivisionDetails.State} */
    this.state = crisis.DivisionDetails.State.VIEWING;
    /** @type {Array<crisis.Unit>} */
    this.newUnits = [];
    /** @type {Array<crisis.Unit>} */
    this.removedUnits = [];
};

crisis.DivisionDetails.prototype.open = function() {
    var dets = this;

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

    if (dets.$pane === null) {
        dets.$pane = crisis.cloneProto(crisis.$protoDivisionDetails);

        dets.$paneInvalidAlert = dets.$pane.find('.paneInvalidAlert');

        dets.$factionNameSpan = dets.$pane.find('.factionNameSpan');
        dets.$factionSelector = dets.$pane.find('.factionSelector');

        dets.$nameSpan = dets.$pane.find('.divisionNameSpan');
        dets.$editNameField = dets.$pane.find('.editNameField');

        dets.$unitList = dets.$pane.find('ul');

        dets.$editButton = dets.$pane.find('.editButton');
        dets.$editButton.on('click' + crisis.event.baseNameSpace, function() {
            dets.enableEdit();
        });

        dets.$addUnitButton = dets.$pane.find('.addUnitButton');
        dets.$addUnitButton.on('click' + crisis.event.baseNameSpace,
            function() {
                dets.addUnit();
            });

        dets.$cancelButton = dets.$pane.find('.cancelButton');

        dets.$commitButton = dets.$pane.find('.commitButton');
        dets.$commitButton.on('click' + crisis.event.baseNameSpace, function() {
            dets.commitEdit();
        });

        dets.$createButton = dets.$pane.find('.createButton');
        dets.$createButton.on('click' + crisis.event.baseNameSpace, function() {
            dets.commitCreate();
        });

        dets.$deleteButton = dets.$pane.find('.deleteButton');
        dets.$deleteButton.on('click' + crisis.event.baseNameSpace, function() {
            dets.commitDelete();
        });

        dets.$closeButton = dets.$pane.find('.closeButton');
        dets.$closeButton.on('click' + crisis.event.baseNameSpace, function() {
            dets.close();
        });

        crisis.map.$holder.append(dets.$pane);
    }

    dets.$nameSpan.text(dets.division.name);
    dets.$factionNameSpan.html(crisis.factionHtml(dets.division.factionId));

    _.each(dets.division.units, function(unit) {
        unit.$listItem.detach();
    });
    dets.$unitList.empty();
    _.each(dets.division.units, function(unit) {
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
    dets.$factionSelector.val(dets.division.factionId);

    dets.$factionNameSpan.hide();
    dets.$nameSpan.hide();
    dets.$editButton.hide();

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

    dets.$paneInvalidAlert.hide();
    _.each(dets.division.units, function(unit) {
        unit.disableEdit();
    });
    _.each(dets.removedUnits, function(unit) {
        unit.$listItem.show();
    });

    dets.state = crisis.DivisionDetails.State.VIEWING;
};

crisis.DivisionDetails.prototype.disableCreate = function() {
    this.division.destroy();
};

crisis.DivisionDetails.prototype.addUnit = function() {
    var dets = this;

    if (dets.state === crisis.DivisionDetails.State.VIEWING) return;

    var currentIds = /** @type {Array<number>} */
        (_.map(dets.division.units.concat(dets.newUnits), function(unit) {
            return unit.typeNum;
        }));

    crisis.map.showUnitTypeFinder(currentIds, dets.$pane, function(num) {
        if (num === null) return;
        var newUnit = new crisis.Unit({
            TypeNum: num,
            TypeName: 'temp',
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
            dets.$paneInvalidAlert.show();
            validSubmit = false;
        } else {
            newUnits.push({TypeNum: unit.typeNum, Amount: newVal});
        }
    });


    var name = /** @type {string?} */(dets.$editNameField.val());
    if (name === dets.division.name) name = null;

    var factionId = /** @type {number?} */
        (crisis.stringToInt(dets.$factionSelector.val()));
    if (factionId === dets.division.factionId) factionId = null;

    if (!validSubmit) return;
    crisis.ajax.postDivisionUpdate(dets.division.id, newUnits, name, factionId,
        {
        /** @param {crisisJson.Division} divData */
        success: function(divData) {
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
            dets.$paneInvalidAlert.show();
            validSubmit = false;
        } else {
            newUnits.push({TypeNum: unit.typeNum, Amount: newVal});
        }
    });

    var name = /** @type {string} */(dets.$editNameField.val());
    if (name === '') {
        dets.$paneInvalidAlert.show();
        validSubmit = false;
    }

    var factionId = /** @type {number?} */
        (crisis.stringToInt(dets.$factionSelector.val()));
    if (factionId === dets.division.factionId) factionId = null;

    if (!validSubmit) return;
    crisis.ajax.postDivisionCreation(
        dets.division.absCoords, newUnits, name, factionId, {
            success: function(divJson) {
                dets.division.destroy();
                crisis.map.addDivision(divJson);
            }
        });
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
    CREATING: 'CREATING'
}
