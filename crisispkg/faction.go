package crisis

import (
	"fmt"
	"gopkg.in/pg.v3"
)

type Faction struct {
	Id   int
	Name string
}

func (fac *Faction) LoadColumn(colIdx int, colName string, b []byte) error {
	switch colName {
	case "id":
		pg.Decode(&fac.Id, b)
	case "faction_name":
		pg.Decode(&fac.Name, b)
	default:
		return fmt.Errorf("tried to load non-existent division column: %s", colName)
	}
	return nil
}

type Factions []Faction

func (factions *Factions) NewRecord() interface{} {
	*factions = append(*factions, Faction{})
	return &(*factions)[len(*factions)-1]
}
