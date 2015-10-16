package crisis

import (
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

func (div Division) GetColumnLoader() pg.ColumnLoader {
	div.Coords = Coords{}
	return pg.LoadInto(&div.Id, &div.Name, &div.FactionId,
		&div.Coords.X, &div.Coords.Y)
}

type Divisions []Division

func (divisions *Divisions) NewRecord() interface{} {
	*divisions = append(*divisions, Division{})
	return (*divisions)[len(*divisions)-1].GetColumnLoader()
}
