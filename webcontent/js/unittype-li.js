/**
 * @constructor
 * @param {crisis.UnitType} unitType
 * @param {boolean} forCreation
 */
crisis.UnitTypeLi = function(unitType, forCreation) {
    /** @type {crisis.UnitType} */
    this.unitType = unitType;
    /** @type {boolean} */
    this.forCreation = forCreation;

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
        this.startEditing();
    });
    this.$cancelButton.on('click' + crisis.event.baseNameSpace, function() {
        if (forCreation) {
            this.destroy();
        } else {
            this.stopEditing();
        }
    });
    this.$deleteButton.on('click' + crisis.event.baseNameSpace, function() {
        this.commitDelete();
    });
    this.$commitButton.on('click' + crisis.event.baseNameSpace, function() {
        this.commit();
    });

    if (!this.forCreation) {
        this.$nameSpan.html(this.unitType.name);
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
    this.$deleteButton.show();
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
    /** @type {string} */
    var name = /** @type {string} */ (this.$editField.val());
    if (name === '' || name === null) {
        return;
    }

    if (this.forCreation) {
        crisis.ajax.postUnitTypeCreation(name, {
            /** @param {crisisJson.UnitType} json */
            success: function(json) {
                this.destroy();
                crisis.addUnitType(new crisis.UnitType(json, false));
            }
        });
    } else {
        crisis.ajax.postUnitTypeUpdate(name, this.unitType.id, {
            /** @param {crisisJson.UnitType} json */
            success: function(json) {

            }
        });
    }
};

crisis.UnitTypeLi.prototype.commitDelete = function() {
    crisis.ajax.postUnitTypeDeletion(this.unitType.id, {
        /** @param {crisisJson.Success} json */
        success: function(json) {
            if (json.Success) {
                this.unitType.destroy();
            }
        }
    });
};

crisis.UnitTypeLi.prototype.destroy = function() {
    this.$listItem.remove();
};

crisis.UnitTypeLi.prototype.reRender = function() {
    this.$nameSpan.html(this.unitType.name);
};
