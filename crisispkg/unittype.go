package crisis

import (
	"fmt"
	"gopkg.in/pg.v3"
)

type UnitType struct {
	Name string
	Id   int
}

func (unitType *UnitType) LoadColumn(colIdx int, colName string, b []byte) error {
	switch colName {
	case "unit_name":
		err := pg.Decode(&unitType.Name, b)
		if err != nil {
			return err
		}
	case "id":
		err := pg.Decode(&unitType.Id, b)
		if err != nil {
			return err
		}
	default:
		return fmt.Errorf("tried to load non-existent division column: %s", colName)
	}
	return nil
}

type UnitTypes []UnitType

func (unitTypes *UnitTypes) NewRecord() interface{} {
	*unitTypes = append(*unitTypes, UnitType{})
	return &(*unitTypes)[len(*unitTypes)-1]
}
