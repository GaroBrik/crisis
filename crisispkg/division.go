package crisis

import (
	"encoding/json"
)

type Division struct {
	Id      int
	Units   []Unit
	DivName string
	FacName string
	CoordX  int
	CoordY  int
	Speed   int
}

func (d Division) MarshalJSON() ([]byte, error) {
	divJson := struct {
		Id        int
		AbsCoords Coords
		Units     []Unit
	}{
		d.Id,
		Coords{d.CoordX, d.CoordY},
		d.Units,
	}
	return json.Marshal(divJson)
}
