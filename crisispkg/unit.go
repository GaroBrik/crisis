package crisis

import (
	"fmt"
	"gopkg.in/pg.v3"
)

type Unit struct {
	Type   int
	Amount int
}

func (unit *Unit) LoadColumn(colIdx int, colName string, b []byte) error {
	switch colName {
	case "unit_type":
		pg.Decode(&unit.Type, b)
	case "amount":
		pg.Decode(&unit.Amount, b)
	default:
		return fmt.Errorf("tried to load non-existent division column: %s", colName)
	}
	return nil
}

type Units []Unit

func (units *Units) NewRecord() interface{} {
	*units = append(*units, Unit{})
	return &(*units)[len(*units)-1]
}
