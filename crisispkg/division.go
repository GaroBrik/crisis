package crisis

import (
	"encoding/json"
)

type Division struct {
	Id        int
	Units     []Unit
	Name      string
	FactionId int
	Coords    Coords
	Speed     int
}
