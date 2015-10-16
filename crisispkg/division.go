package crisis

import (
	"fmt"
	"gopkg.in/pg.v3"
	"log"
)

type Division struct {
	Id           int
	Units        []Unit
	DivisionName string
	FactionId    int
	Coords       Coords
	Speed        int `json:"-"`
}

func (div Division) GetColumnLoader() pg.ColumnLoader {
	div.Coords = Coords{}
	return pg.LoadInto(&div.Id, &div.DivisionName, &div.FactionId,
		&div.Coords.X, &div.Coords.Y)
}

func (div *Division) LoadColumn(colIdx int, colName string, b []byte) error {
	log.Println(colIdx, colName, b)
	switch colName {
	case "id":
		pg.Decode(&div.Id, b)
	case "division_name":
		pg.Decode(&div.DivisionName, b)
	case "faction":
		pg.Decode(&div.FactionId, b)
	case "x":
		pg.Decode(&div.Coords.X, b)
	case "y":
		pg.Decode(&div.Coords.Y, b)
	default:
		return fmt.Errorf("tried to load non-existent division column: %s", colName)
	}
	return nil
}

type Divisions []Division

func (divisions *Divisions) NewRecord() interface{} {
	*divisions = append(*divisions, Division{})
	return &(*divisions)[len(*divisions)-1]
}
