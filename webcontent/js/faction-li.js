/**
 * @constructor
 * @param {crisis.Faction} faction
 * @param {boolean} forCreation
 * @implements {crisis.Faction.ChangeListener}
 */
crisis.FactionLi = function(faction, forCreation) {
    /** @type {crisis.FactionLi} */
    var thisLi = this;

    /** @type {crisis.Faction} */
    this.faction = faction;
    /** @type {boolean} */
    this.forCreation = forCreation;

    /** @type {jQuery} */
    this.$listItem = crisis.cloneProto(
        crisis.prototypes.$controlsFactionListItem);
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
    /** @type {jQuery} */
    this.$colorPicker = this.$listItem.find('.colorPicker');

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
        if (confirm('Deleting a faction will delete all divisions currently ' +
                    'in the faction. Are you sure?'))
        {
            thisLi.commitDelete();
        }
    });
    this.$commitButton.on('click' + crisis.event.baseNameSpace, function() {
        thisLi.commit();
    });

    if (!this.forCreation) {
        this.$nameSpan.text(this.faction.name);
        this.faction.listeners.add(this);
    } else {
        this.startEditing();
    }

    crisis.controls.$factionList.append(this.$listItem);
};

crisis.FactionLi.prototype.startEditing = function() {
    if (!this.forCreation) {
        this.$editField.val(this.faction.name);
        this.$colorPicker.val(this.faction.color);
    }

    this.$nameSpan.hide();
    this.$editButton.hide();

    this.$editField.show();
    this.$colorPicker.show();
    this.$cancelButton.show();
    if (!this.forCreation) {
        this.$deleteButton.show();
    }
    this.$commitButton.show();
};

crisis.FactionLi.prototype.stopEditing = function() {
    if (this.forCreation) this.destroy();

    this.$editField.hide();
    this.$colorPicker.hide();
    this.$cancelButton.hide();
    this.$deleteButton.hide();
    this.$commitButton.hide();

    this.$nameSpan.show();
    this.$editButton.show();
};

crisis.FactionLi.prototype.commit = function() {
    /** @type {crisis.FactionLi} */
    var thisLi = this;

    /** @type {string} */
    var name = /** @type {string} */ (this.$editField.val());
    if (name === '' || name === null) {
        return;
    }

    /** @type {string} */
    var color = /** @type {string} */ (this.$colorPicker.val());
    if (color === '' || color === null) {
        return;
    }

    if (this.forCreation) {
        crisis.ajax.postFactionCreation(name, color, {
            /** @param {crisisJson.Faction} json */
            success: function(json) {
                thisLi.destroy();
                crisis.addFaction(crisis.Faction.fromJson(json));
            }
        });
    } else {
        crisis.ajax.postFactionUpdate(name, color, this.faction.id, {
            /** @param {crisisJson.Faction} json */
            success: function(json) {
                thisLi.faction.update(json);
                thisLi.stopEditing();
            }
        });
    }
};

crisis.FactionLi.prototype.commitDelete = function() {
    /** @type {crisis.FactionLi} */
    var thisLi = this;

    crisis.ajax.postFactionDeletion(this.faction.id, {
        /** @param {crisisJson.SuccessResponse} json */
        success: function(json) {
            if (json.Success) {
                thisLi.faction.destroy();
            }
        }
    });
};

crisis.FactionLi.prototype.destroy = function() {
    this.$listItem.remove();
};

/**
 * @override
 * @param {crisis.Faction} faction
 */
crisis.FactionLi.prototype.factionChanged = function(faction) {
    this.$nameSpan.text(faction.name);
};

/**
 * @override
 * @param {number} facId
 */
crisis.FactionLi.prototype.factionDestroyed = function(facId) {
    this.destroy();
};

/**
 * @override
 * @return {string}
 */
crisis.FactionLi.prototype.listenerId = function() {
    return 'factionLi(' + this.faction.id + ')';
};
