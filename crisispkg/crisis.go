package crisis

import (
	"fmt"
	"gopkg.in/pg.v3"
)

type Crisis struct {
	Id        int `json:"-"`
	Active    bool
	MapBounds Bounds
	Speed     int
	Divisions []Division
	UnitTypes []UnitType
	Factions  []Faction
	MapCosts  [][]int
}

func (crisis *Crisis) LoadColumn(colIdx int, colName string, b []byte) error {
	switch colName {
	case "id":
		err := pg.Decode(&crisis.Id, b)
		if err != nil {
			return err
		}
	case "active":
		err := pg.Decode(&crisis.Active, b)
		if err != nil {
			return err
		}
	case "width":
		err := pg.Decode(&crisis.MapBounds.Width, b)
		if err != nil {
			return err
		}
	case "height":
		err := pg.Decode(&crisis.MapBounds.Height, b)
		if err != nil {
			return err
		}
	case "speed":
		err := pg.Decode(&crisis.Speed, b)
		if err != nil {
			return err
		}
	default:
		return fmt.Errorf("tried to load non-existent division column: %s", colName)
	}
	return nil
}

type Crises []Crisis

func (crises *Crises) NewRecord() interface{} {
	*crises = append(*crises, Crisis{})
	return &(*crises)[len(*crises)-1]
}
