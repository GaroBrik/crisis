package crisis

import (
	"fmt"
	"gopkg.in/pg.v3"
)

type Division struct {
	Id        int
	Units     []Unit
	Name      string
	FactionId int
	Coords    Coords
	Speed     int `json:"-"`
}

func (div *Division) LoadColumn(colIdx int, colName string, b []byte) error {
	switch colName {
	case "id":
		err := pg.Decode(&div.Id, b)
		if err != nil {
			return err
		}
	case "division_name":
		err := pg.Decode(&div.Name, b)
		if err != nil {
			return err
		}
	case "faction":
		err := pg.Decode(&div.FactionId, b)
		if err != nil {
			return err
		}
	case "x":
		err := pg.Decode(&div.Coords.X, b)
		if err != nil {
			return err
		}
	case "y":
		err := pg.Decode(&div.Coords.Y, b)
		if err != nil {
			return err
		}
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
