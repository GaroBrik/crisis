package crisis

type Crisis struct {
	MapBounds Bounds
	MapCosts  [][]int
	Divisions []*Division
}
