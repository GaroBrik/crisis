package crisis

import (
	"fmt"
	"gopkg.in/pg.v3"
	"math"
	"strconv"
)

type Coords struct {
	X int
	Y int
}

func (this Coords) distanceTo(other *Coords) float64 {
	return math.Hypot(float64(this.X-other.X), float64(this.Y-other.Y))
}

func (coords *Coords) LoadColumn(colIdx int, colName string, b []byte) error {
	switch colName {
	case "x":
		err := pg.Decode(&coords.X, b)
		if err != nil {
			return err
		}
	case "y":
		err := pg.Decode(&coords.Y, b)
		if err != nil {
			return err
		}
	default:
		return fmt.Errorf("tried to load non-existent division column: %s", colName)
	}
	return nil
}

type Coordses []Coords

func (coordses Coordses) AppendQuery(dst []byte) []byte {
	for i, v := range coordses {
		dst = append(dst, '"')
		dst = append(dst, '(')
		dst = strconv.AppendInt(dst, int64(v.X), 10)
		dst = append(dst, ',')
		dst = strconv.AppendInt(dst, int64(v.Y), 10)
		dst = append(dst, ')')
		dst = append(dst, '"')
		if i != len(coordses)-1 {
			dst = append(dst, ',')
		}
	}
	return dst
}

func (coordses *Coordses) NewRecord() interface{} {
	*coordses = append(*coordses, Coords{})
	return &(*coordses)[len(*coordses)-1]
}
