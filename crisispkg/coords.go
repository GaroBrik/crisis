package crisis

import (
	"fmt"
	"math"
)

type Coords struct {
	X int
	Y int
}

func (this *Coords) distanceTo(other *Coords) float64 {
	return math.Hypot(float64(this.X-other.X), float64(this.Y-other.Y))
}

func (this *Coords) dbString() string {
	return fmt.Sprintf("(%d,%d)", this.X, this.Y)
}
