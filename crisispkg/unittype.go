package crisis

type UnitType struct {
	UnitName string
	Id       int
}

type UnitTypes []UnitType

func (unitTypes *UnitTypes) NewRecord() interface{} {
	*unitTypes = append(*unitTypes, UnitType{})
	return &(*unitTypes)[len(*unitTypes)-1]
}
