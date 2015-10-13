package crisis

import (
	"fmt"
	"math"
	"strings"
)

type Coords struct {
	X int
	Y int
}

func (this *Coords) distanceTo(other *Coords) float64 {
	return math.Hypot(float64(this.X-other.X), float64(this.Y-other.Y))
}

func (this *Coords) dbString() string {
	return fmt.Sprintf("\"(%d,%d)\"", this.X, this.Y)
}

func makeDbCoordsArray(coords *[]*Coords) string {
	coordStrings := make([]string, len(*coords))
	for i, coord := range *coords {
		coordStrings[i] = coord.dbString()
	}
	return "'{" + strings.Join(coordStrings, ",") + "}'::coords[]"
}
