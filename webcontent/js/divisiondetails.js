/**
 * @constructor
 * @param {crisis.Division} div
 */
crisis.DivisionDetails = function(div) {
    /** @type {jQuery} */
    this.$pane = null;
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

crisis.DivisionDetails.prototype.toggle = function() {
    if (this.isOpen) {
        this.close();
    } else {
        this.open();
    }
};

crisis.DivisionDetails.prototype.open = function() {
    var dets = this;

    if (dets.unRendered) {
        dets.reRender();
        dets.unRendered = false;
    }
    crisis.map.positionDropdown(dets.$pane, dets.division.$marker,
                                crisis.map.$holder);
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
        dets.$nameSpan = dets.$pane.find('.divisionNameSpan');
        dets.$editNameField = dets.$pane.find('.editNameField');
        dets.$unitList = dets.$pane.find('ul');
        dets.$paneInvalidAlert = dets.$pane.find('.paneInvalidAlert');

        dets.$editButton = dets.$pane.find('.editButton');
        dets.$editButton.on('click' + crisis.event.baseNameSpace, function() {
            dets.enableEdit();
        });

        dets.$addUnitButton = dets.$pane.find('.addUnitButton');
        dets.$addUnitButton.on('click' + crisis.event.baseNameSpace, function() {
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


        dets.$closeButton = dets.$pane.find('.closeButton');
        dets.$closeButton.on('click' + crisis.event.baseNameSpace, function() {
            dets.close();
        });

        dets.$nameSpan.text(dets.division.name);
        crisis.map.$holder.append(dets.$pane);
    }

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

    dets.$nameSpan.hide();
    dets.$editNameField.val(dets.division.name);
    dets.$editNameField.show();

    dets.$editButton.hide();
    dets.$cancelButton.show();
    dets.$commitButton.show();
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

    dets.$nameSpan.hide();
    dets.$editButton.hide();
    dets.$editNameField.val(dets.division.name);
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

    dets.$editNameField.hide();
    dets.$nameSpan.show();

    dets.$editButton.show();
    dets.$cancelButton.hide();
    dets.$commitButton.hide();
    dets.$addUnitButton.hide();

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
        console.log('test2');
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

    if (!validSubmit) return;
    crisis.ajax.postDivisionUpdate(dets.division.id, newUnits, name, {
        /** @param {crisisJson.Division} divData */
        success: function(divData) {
            dets.division.update(divData);
            console.log('testeditupdate');
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

    if (!validSubmit) return;
    crisis.ajax.postDivisionCreation(
        dets.division.absCoords, newUnits, name, 1, {
            success: function(divJson) {
                dets.division.destroy();
                crisis.map.addDivision(divJson);
            }
        });
};

/** @enum {string} */
crisis.DivisionDetails.State = {
    VIEWING: 'VIEWING',
    EDITING: 'EDITING',
    CREATING: 'CREATING'
}
