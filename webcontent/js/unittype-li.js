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
        crisis.$protoUnitTypeListItems.find(
            crisis.dataSelector(id, 'unitType')));
    /** @type {jQuery} */
    this.$editButton = $listItem.find('.editButton');
    /** @type {jQuery} */
    this.$cancelButton = $listItem.find('.cancelButton');
    /** @type {jQuery} */
    this.$deleteButton = $listItem.find('.deleteButton');
    /** @type {jQuery} */
    this.$commitButton = $listItem.find('.commitButton');
    /** @type {jQuery} */
    this.$editField = $listItem.find('.editField');
    /** @type {jQuery} */
    this.$nameSpan = $listItem.find('.name');

    this.$editButton.on('click' + crisis.baseNameSpace, function() {
        this.startEditing();
    });
    this.$cancelButton.on('click' + crisis.baseNameSpace, function() {
        if (forCreation) {
            this.destroy();
        } else {
            this.stopEditing();
        }
    });
    this.$deleteButton.on('click' + crisis.baseNameSpace, function() {
        this.deleteUnitType();
    });
    this.$commitButton.on('click' + crisis.baseNameSpace, function() {
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
        this.$editField.val(this.name);
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
    var name = this.$editField.val();
    if (name === '' || name === null) {
        return;
    }

    if (forCreation) {
        crisis.ajax.postUnitTypeCreation(name, {
            /** @param {crisisJson.UnitType} json */
            success: function(json) {
                this.destroy();
                crisis.addUnitType(new crisis.UnitType(json));
            }
        });
    } else {
        crisis.ajax.postUnitTypeUpdate(this.unitType.id, name, {
            /** @param {crisisJson.UnitType} json */
            success: function(json) {

            }
        });
    }
};

crisis.UnitTypeLi.prototype.commitDelete = function() {
    crisis.ajax.postUnitTypeDeletion(this.unitType.id, {
        /** @param {crisisJson.Sucess} json */
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
