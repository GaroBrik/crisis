package crisis

type searchTrack struct {
	prevCoords Coords
	used       bool
	minCost    int
}

const (
	sqrt2 = 1.41
)

// func computeFullPath(route *[]Coords, costs *[][]int) []Coords {
// 	fullPath := make([]Coords)
// 	fullPath = append(fullPath, route[0])
// 	for i := 1; i < len(route); i++ {
// 		fullPath = append(fullPath, m.computePath(route[i-1], route[i]))
// 	}
// 	return fullPath
// }

// func computePath(start Coords, finish Coords, costs *[][]int) []Coords {
// 	next := start
// 	stat := make([][]searchTrack, m.Bounds.Height)
// 	minqueue := createMinQueue()
// 	for i := 0; i < m.Bounds.Height; i++ {
// 		stat[i] = make([]searchTrack, m.Bounds.Width)
// 		for j := 0; j < m.Bounds.Width; j++ {
// 			stat[i][j] = searchTrack{nil, false, -1}
// 		}
// 	}

// 	for next != finish {
// 		next = findNext(&minqueue, &stat, costs, next)
// 	}

// 	result := make([]Coords)
// 	for next != start {
// 		result = append(result, next)
// 		next = stat[next.Y][next.X].prevCoords
// 	}

// 	return reverse(result)
// }

// func findNext(minqueue *minqueue, stat *[][]searchTrack, costs *[][]int, cur Coords) Coords {
// 	curCost := stat[next.Y][next.X].minCost + m.Costs[next.Y][next.X]
// 	curCostDiag := stat[next.Y][next.X].minCost + sqrt2*m.Costs[next.Y][next.X]
// 	for i := -1; i <= 1; i++ {
// 		for j := -1; j <= 1; j++ {
// 			if (i != 0 || j != 0) && valid(i, j, m.Bounds) {
// 				testing := &stat[next.Y+i][next.X+j]
// 				if !testing.used {
// 					costTo = curCost
// 					if i != 0&j != 0 {
// 						costto = curCostDiag
// 					}
// 					if costTo < testing.minCost {
// 						testing.minCost = costTo
// 						testing.prevCoords = next
// 						minqueue.add(testing)
// 					}
// 				}
// 			}
// 		}
// 	}

// 	return minqueue.popMin()
// }
