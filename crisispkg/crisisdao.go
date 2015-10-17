package crisis

import (
	"errors"
	"gopkg.in/pg.v3"
)

func GetAllActiveCrises(tx *pg.Tx) ([]Crisis, error) {
	var crises Crises
	_, err := tx.Query(&crises, "SELECT id, active FROM crisis WHERE active")
	if err != nil {
		return nil, err
	}

	for _, crisis := range crises {
		_, err = LoadCrisis(tx, &crisis)
		if err != nil {
			return nil, err
		}
	}

	return crises, nil
}

func LoadCrisis(tx *pg.Tx, crisis *Crisis) (Crisis, error) {
	crisis.MapCosts, err = GetMapCostsByCrisisId(tx, crisis.Id)
	if err != nil {
		return *crisis, err
	}

	crisis.Divisions, err = GetDivisionsByCrisisId(tx, crisis.Id)
	return *crisis, err
}

func GetMapCostsByCrisisId(tx *pg.Tx, crisisId int) ([][]int, error) {
	var height int
	var width int
	_, err := tx.QueryOne(pg.LoadInto(&height, &width), `
            SELECT array_length(map_costs, 1), array_length(map_costs, 2) 
            FROM crisis WHERE id = ?
         `, crisisId)
	if err != nil {
		return nil, err
	}

	var costs pg.Ints
	_, err = tx.Query(&costs, `
            SELECT UNNEST(map_costs) FROM crisis WHERE id = ?
        `, crisisId)
	if err != nil {
		return nil, err
	}

	result := make([][]int, height)
	for i := 0; i < height; i++ {
		result[i] = make([]int, width)
		for j := 0; j < width; j++ {
			idx := i*width + j
			if idx > len(costs) {
				return nil, errors.New(
					`number of elements in map cost did not match bounds`)
			}
			result[i][j] = int(costs[idx])
		}
	}

	return result, nil
}
