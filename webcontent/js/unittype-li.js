/**
 * @constructor
 * @implements {crisis.UnitType.ChangeListener}
 * @param {crisis.UnitType} unitType
 * @param {boolean} forCreation
 */
crisis.UnitTypeLi = function(unitType, forCreation) {
    /** @type {crisis.UnitTypeLi} */
    var thisLi = this;

    /** @type {boolean} */
    this.forCreation = forCreation;
    /** @type {crisis.UnitType} */
    this.unitType = unitType;

    /** @type {jQuery} */
    this.$listItem = crisis.cloneProto(
        crisis.prototypes.$controlsUnitTypeListItem);
    /** @type {jQuery} */
    this.$editButton = this.$listItem.find('.editButton');
    /** @type {jQuery} */
    this.$cancelButton = this.$listItem.find('.cancelButton');
    /** @type {jQuery} */
    this.$deleteButton = this.$listItem.find('.deleteButton');
    /** @type {jQuery} */
    this.$commitButton = this.$listItem.find('.commitButton');
    /** @type {jQuery} */
    this.$editField = this.$listItem.find('.editField');
    /** @type {jQuery} */
    this.$nameSpan = this.$listItem.find('.name');

    this.$editButton.on('click' + crisis.event.baseNameSpace, function() {
        thisLi.startEditing();
    });
    this.$cancelButton.on('click' + crisis.event.baseNameSpace, function() {
        if (forCreation) {
            thisLi.destroy();
        } else {
            thisLi.stopEditing();
        }
    });
    this.$deleteButton.on('click' + crisis.event.baseNameSpace, function() {
        if (confirm('Deleting a unit type will delete all units of that type.' +
                    ' Are you sure?'))
        {
            thisLi.commitDelete();
        }
    });
    this.$commitButton.on('click' + crisis.event.baseNameSpace, function() {
        thisLi.commit();
    });

    if (!this.forCreation) {
        this.$nameSpan.text(unitType.name);
        unitType.listeners.add(this);
    } else {
        this.startEditing();
    }
    crisis.controls.$unitTypeList.append(this.$listItem);
};

crisis.UnitTypeLi.prototype.startEditing = function() {
    if (!this.forCreation) {
        this.$editField.val(this.unitType.name);
    }

    this.$nameSpan.hide();
    this.$editButton.hide();

    this.$editField.show();
    this.$cancelButton.show();
    if (!this.forCreation) {
        this.$deleteButton.show();
    }
    this.$commitButton.show();
};

crisis.UnitTypeLi.prototype.stopEditing = function() {
    if (this.forCreation) this.destroy();

    this.$editField.hide();
    this.$cancelButton.hide();
    this.$deleteButton.hide();
    this.$commitButton.hide();

    this.$nameSpan.show();
    this.$editButton.show();
};

crisis.UnitTypeLi.prototype.commit = function() {
    /** @type {crisis.UnitTypeLi} */
    var thisLi = this;
    
    /** @type {string} */
    var name = /** @type {string} */ (this.$editField.val());
    if (name === '' || name === null) {
        return;
    }

    if (this.forCreation) {
        crisis.ajax.postUnitTypeCreation(name, {
            /** @param {crisisJson.UnitType} json */
            success: function(json) {
                thisLi.destroy();
                crisis.addUnitType(crisis.UnitType.fromJson(json));
            }
        });
    } else {
        crisis.ajax.postUnitTypeUpdate(name, this.unitType.id, {
            /** @param {crisisJson.UnitType} json */
            success: function(json) {
                thisLi.unitType.update(json);
                thisLi.stopEditing();
            }
        });
    }
};

crisis.UnitTypeLi.prototype.commitDelete = function() {
    /** @type {crisis.UnitTypeLi} */
    var thisLi = this;
    
    crisis.ajax.postUnitTypeDeletion(this.unitType.id, {
        /** @param {crisisJson.Success} json */
        success: function(json) {
            if (json.Success) {
                thisLi.unitType.destroy();
            }
        }
    });
};

crisis.UnitTypeLi.prototype.destroy = function() {
    this.$listItem.remove();
    if (!this.forCreation) {
        this.unitType.listeners.remove(this);
    }
};

/** @param {crisis.UnitType} unitType */
crisis.UnitTypeLi.prototype.unitTypeChanged = function(unitType) {
    this.$nameSpan.text(unitType.name);
};

/** @return {string} */
crisis.UnitTypeLi.prototype.listenerId = function() {
    return 'unitTypeLi(' + this.unitType.id + ')';
};
