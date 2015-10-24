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
        crisis.prototypes.$controlsFactionListItem.find(
            crisis.dataSelector(this.faction.id, 'faction')));
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
        this.$nameSpan.html(this.faction.name);
    } else {
        this.startEditing();
    }
    crisis.controls.$factionList.append(this.$listItem);
};

crisis.FactionLi.prototype.startEditing = function() {
    if (!this.forCreation) {
        this.$editField.val(this.faction.name);
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
    var name = /** @type {string} */ (this.$editField.val());
    if (name === '' || name === null) {
        return;
    }

    if (this.forCreation) {
        crisis.ajax.postFactionCreation(name, {
            /** @param {crisisJson.Faction} json */
            success: function(json) {
                this.destroy();
                crisis.addFaction(new crisis.Faction(json, false));
            }
        });
    } else {
        crisis.ajax.postFactionUpdate(name, this.faction.id, {
            /** @param {crisisJson.Faction} json */
            success: function(json) {

            }
        });
    }
};

crisis.FactionLi.prototype.commitDelete = function() {
    crisis.ajax.postFactionDeletion(this.faction.id, {
        /** @param {crisisJson.Success} json */
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
