package crisis

import (
	"math"
	"strconv"
)

type Coords struct {
	X int
	Y int
}

func (this *Coords) distanceTo(other *Coords) float64 {
	return math.Hypot(float64(this.X-other.X), float64(this.Y-other.Y))
}

type Coordses []Coords

func (coordses Coordses) AppendQuery(dst []byte) []byte {
	for i, v := range coordses {
		dst = append(dst, '(')
		dst = strconv.AppendInt(dst, int64(v.X), 10)
		dst = append(dst, ',')
		dst = strconv.AppendInt(dst, int64(v.Y), 10)
		dst = append(dst, ')')
		if i != len(coordses)-1 {
			dst = append(dst, ',')
		}
	}
	return dst
}
