/**
 * @constructor
 * @param {crisis.Faction} faction
 * @param {boolean} forCreation
 */
crisis.FactionLi = function(faction, forCreation) {
    /** @type {crisis.Faction} */
    this.faction = faction;
    /** @type {boolean} */
    this.forCreation = forCreation;

    /** @type {jQuery} */
    this.$listItem = crisis.cloneProto(
        crisis.$protoFactionListItems.find(crisis.dataSelector(id, 'faction')));
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
        this.deleteFaction();
    });
    this.$commitButton.on('click' + crisis.baseNameSpace, function() {
        this.commit();
    });

    if (!this.forCreation) {
        this.$nameSpan.html(this.faction.name);
    } else {
        this.startEditing();
    }
    crisis.controls.$factionList.append(this.$listItem);
};

crisis.FactionLi.prototype.startEditing = function() {
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

crisis.FactionLi.prototype.stopEditing = function() {
    if (this.forCreation) this.destroy();

    this.$editField.hide();
    this.$cancelButton.hide();
    this.$deleteButton.hide();
    this.$commitButton.hide();

    this.$nameSpan.show();
    this.$editButton.show();
};

crisis.FactionLi.prototype.commit = function() {
    /** @type {string} */
    var name = this.$editField.val();
    if (name === '' || name === null) {
        return;
    }

    if (forCreation) {
        crisis.ajax.postFactionCreation(name, {
            /** @param {crisisJson.Faction} json */
            success: function(json) {
                this.destroy();
                crisis.addFaction(new crisis.Faction(json));
            }
        });
    } else {
        crisis.ajax.postFactionUpdate(this.faction.id, name, {
            /** @param {crisisJson.Faction} json */
            success: function(json) {

            }
        });
    }
};

crisis.FactionLi.prototype.commitDelete = function() {
    crisis.ajax.postFactionDeletion(this.faction.id, {
        /** @param {crisisJson.Sucess} json */
        success: function(json) {
            if (json.Success) {
                this.faction.destroy();
            }
        }
    });
};

crisis.FactionLi.prototype.destroy = function() {
    this.$listItem.remove();
};

crisis.FactionLi.prototype.reRender = function() {
    this.$nameSpan.html(this.faction.name);
};
