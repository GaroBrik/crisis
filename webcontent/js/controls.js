crisis.controls = {
    /** @enum {string} */
    State: {
        OPEN: 'OPEN',
        CLOSED: 'CLOSED'
    },
    /** @type {crisis.controls.State} */
    state: null,
    /** @type {boolean} */
    initialized: false,
    /** @type {boolean} */
    unRendered: true,

    /** @type {jQuery} */
    $controls: null,
    /** @type {jQuery} */
    $unitTypeList: null,
    /** @type {jQuery} */
    $factionList: null
};

crisis.controls.initialize = function() {
    crisis.controls.state = crisis.controls.State.CLOSED;
    
    crisis.controls.$controls = $('#controls');
    crisis.controls.$unitTypeList = $('#controlsUnitTypeList');
    crisis.controls.$factionList = $('#controlsFactionList');
    crisis.controls.$addUnitTypeButton = $('#addUnitTypeButton');
    crisis.controls.$addFactionButton = $('#addFactionButton');

    crisis.controls.$addUnitTypeButton.on(
        'click' + crisis.event.baseNameSpace, function() {
            new crisis.UnitTypeLi(null, true);
        });
    crisis.controls.$addFactionButton.on(
        'click' + crisis.event.baseNameSpace, function() {
            new crisis.FactionLi(null, true);
        });
};

crisis.controls.toggle = function() {
    if (crisis.controls.state === crisis.controls.State.OPEN) {
        crisis.controls.close();
    } else if (crisis.controls.state === crisis.controls.State.CLOSED) {
        crisis.controls.open();
    }
};

crisis.controls.open = function() {
    if (crisis.controls.state === crisis.controls.State.OPEN) return;

    if (!crisis.controls.initialized) {
        crisis.controls.initialize();
        crisis.controls.initialized = true;
    }

    if (crisis.controls.unRendered) {
        crisis.controls.render();
        crisis.controls.unRendered = false;
    }

    crisis.controls.$controls.show();

    crisis.controls.state = crisis.controls.State.OPEN;
};

crisis.controls.close = function() {
    if (crisis.controls.state === crisis.controls.State.CLOSED) return;

    crisis.controls.$controls.hide();

    crisis.controls.state = crisis.controls.State.CLOSED;
};

crisis.controls.reRender = function() {
    if (crisis.controls.state === crisis.controls.State.CLOSED) {
        crisis.controls.unRendered = true;
    } else {
        crisis.controls.render();
    }
};

crisis.controls.render = function() {};
