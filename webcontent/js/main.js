crisis = {
    $g_protoDivisionMarker: null,
    $g_protoDivisionDetails: null,
    $g_protoUnitListItem: null,
    $g_protoUnitTypes: null
    
    init: function() {
	      var $prototypes = $("#htmlObjectPrototypes");
	      this.$g_protoDivisionMarker = $prototypes.find("#protoDivisionMarker");
	      this.$g_protoDivisionDetails = $prototypes.find("#protoDivisionDetails");
	      this.$g_protoUnitListItem = $prototypes.find("#protoUnitListItem");
	      this.$g_protoUnitTypes = $prototypes.find("#protoUnitTypes");
    }
}
