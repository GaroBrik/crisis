package crisis

import (
	"github.com/Workiva/go-datastructures/queue"
)

type searchTrack struct {
	prevCoords *Coords
	minCost    float64
}

const (
	sqrt2 = 1.41
)

func computeFullPath(route *[]*Coords, costs *[][]int) ([]*Coords, bool) {
	fullPath := make([]*Coords, 0)
	fullPath = append(fullPath, (*route)[0])
	for i := 1; i < len(*route); i++ {
		nextPath, hasPath := computePath((*route)[i-1], (*route)[i], costs)
		if !hasPath {
			return nil, false
		}
		fullPath = append(fullPath,
			nextPath...)
	}
	return fullPath, true
}

func computePath(start *Coords, finish *Coords, costs *[][]int) ([]*Coords, bool) {
	next := start
	prev := make([][]*Coords, len(*costs))
	queue := queue.NewPriorityQueue(int(start.distanceTo(finish)), true)
	queue.Put(trackedNode{start, nil, 0, start.distanceTo(finish)})

	for i := 0; i < len(*costs); i++ {
		prev[i] = make([]*Coords, len((*costs)[i]))
		for j := 0; j < len(prev[i]); j++ {
			prev[i][j] = nil
		}
	}

	for *next != *finish && !queue.Empty() {
		next = computeNext(queue, &prev, costs, finish)
	}

	if *next != *finish {
		return nil, false
	}

	result := make([]*Coords, 0)
	for next != start {
		result = append(result, next)
		next = prev[next.Y][next.X]
	}

	for i, j := 0, len(result)-1; i < j; i, j = i+1, j-1 {
		result[i], result[j] = result[j], result[i]
	}
	return result, true
}

func computeNext(queue *queue.PriorityQueue, prev *[][]*Coords,
	costs *[][]int, target *Coords) *Coords {
	cur := myPop(queue)
	for (*prev)[cur.coords.Y][cur.coords.X] != nil {
		cur = myPop(queue)
	}
	(*prev)[cur.coords.Y][cur.coords.X] = cur.prev
	curCost := cur.cost + float64((*costs)[cur.coords.Y][cur.coords.X])
	curCostDiag := cur.cost +
		sqrt2*float64((*costs)[cur.coords.Y][cur.coords.X])
	for i := -1; i <= 1; i++ {
		for j := -1; j <= 1; j++ {
			if (i != 0 || j != 0) && valid(cur.coords, i, j, costs) {
				if (*prev)[i][j] == nil {
					costTo := curCost
					if i != 0 && j != 0 {
						costTo = curCostDiag
					}
					queue.Put(&trackedNode{
						&Coords{i, j},
						cur.coords,
						costTo,
						target.distanceTo(&Coords{i, j}),
					})
				}
			}
		}
	}

	return cur.coords
}

func valid(fixed *Coords, y int, x int, costs *[][]int) bool {
	xd, yd := fixed.X+x, fixed.Y+y
	return yd >= 0 && xd >= 0 && yd < len(*costs) && xd < len((*costs)[0])
}

func myPop(queue *queue.PriorityQueue) *trackedNode {
	cur, err := queue.Get(1)
	maybePanic(err)
	return cur[0].(*trackedNode)
}

type trackedNode struct {
	coords *Coords
	prev   *Coords
	cost   float64
	target float64
}

func (this trackedNode) Compare(otherItem queue.Item) int {
	other := otherItem.(trackedNode)

	if this.cost+this.target < other.cost+other.target {
		return -1
	} else if this.cost+this.target > other.target+other.cost {
		return 1
	}

	return 0
}
