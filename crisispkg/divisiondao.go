package crisis

import (
	"gopkg.in/pg.v3"
)

const (
	divisionInfoSelector = ` 
            division.id, division.division_name, division.faction, 
	        division.route[1].x, division.route[1].y, division.time_spent
        `
)

func CreateDivision(tx *pg.Tx, coords Coords, units []Unit, name string,
	factionId int) (int, error) {
	div := Division{
		Units:     units,
		Name:      name,
		Coords:    coords,
		FactionId: factionId,
	}
	_, err := tx.QueryOne(&div, `
            INSERT INTO division (faction, division_name, route) 
		    VALUES(?, ?, ARRAY[(?, ?)]::coords[]) RETURNING id
        `, div.FactionId, div.Name, div.Coords.X, div.Coords.Y)

	if err != nil {
		return 0, err
	}

	err = UpdateDivisionVisibility(tx, div.Id, []int{factionId})
	if err != nil {
		return 0, err
	}

	err = UpdateDivisionUnits(tx, div.Id, div.Units)
	return div.Id, err
}

func UpdateDivision(tx *pg.Tx, divisionId int, units []Unit,
	name *string, factionId *int) error {

	if name != nil {
		_, err := tx.Exec(`
                UPDATE division SET division_name = ? WHERE id = ?
            `, name, divisionId)
		if err != nil {
			return err
		}
	}
	if factionId != nil {
		_, err := tx.Exec(`
                 UPDATE division SET faction = ? WHERE id = ?
           `, factionId, divisionId)
		if err != nil {
			return err
		}
	}

	err := UpdateDivisionUnits(tx, divisionId, units)
	return err
}

func UpdateDivisionVisibility(tx *pg.Tx, divId int, factionIds []int) error {
	_, err := tx.Exec(`
            DELETE FROM division_view WHERE division_id = ?
        `, divId)
	if err != nil {
		return err
	}

	stmt, err := tx.Prepare(`
            INSERT INTO division_view (division_id, faction_id) VALUES($1, $2)
        `)
	if err != nil {
		return err
	}

	for _, facId := range factionIds {
		_, err = stmt.Exec(divId, facId)
		if err != nil {
			return err
		}
	}

	return nil
}

func UpdateDivisionUnits(tx *pg.Tx, divisionId int, units []Unit) error {
	_, err := tx.Exec(`
            DELETE FROM unit WHERE unit.division = ?
        `, divisionId)
	if err != nil {
		return err
	}

	stmt, err := tx.Prepare(`
             INSERT INTO unit (division, unit_type, amount) VALUES ($1, $2, $3)
         `)
	if err != nil {
		return err
	}

	for _, unit := range units {
		_, err = stmt.Exec(divisionId, unit.Type, unit.Amount)
		if err != nil {
			return err
		}
	}

	err = stmt.Close()
	return err
}

func UpdateDivisionRoute(tx *pg.Tx, divisionId int, route []Coords) error {
	_, err := tx.Exec(`UPDATE division SET route = '{?}'::coords[] WHERE id = ?`,
		Coordses(route), divisionId)
	return err
}

func DeleteDivision(tx *pg.Tx, divisionId int) error {
	_, err := tx.Exec(`DELETE FROM division WHERE id = ?`, divisionId)
	return err
}

func GetDivision(tx *pg.Tx, divisionId int) (Division, error) {
	div := Division{}
	_, err := tx.QueryOne(&div, `
            SELECT `+divisionInfoSelector+` 
            FROM division WHERE division.id = ?
        `, divisionId)
	if err != nil {
		return div, err
	}

	return LoadDivision(tx, &div)
}

func GetDivisionsByCrisisId(tx *pg.Tx, crisisId int) ([]Division, error) {
	var divs Divisions
	_, err := tx.Query(&divs, `
            SELECT `+divisionInfoSelector+` 
            FROM division INNER JOIN faction ON (faction.id = division.faction)
		    WHERE faction.crisis = ?
        `, crisisId)
	if err != nil {
		return nil, err
	}

	return LoadDivisions(tx, divs)
}

func GetDivisionsForFactionId(tx *pg.Tx, factionId int) ([]Division, error) {
	var divs Divisions
	_, err := tx.Query(&divs, `
            SELECT `+divisionInfoSelector+` 
            FROM division INNER JOIN division_view 
                ON division.id = division_view.division_id 
            WHERE division_view.faction_id = ?`, factionId)
	if err != nil {
		return nil, err
	}

	return LoadDivisions(tx, divs)
}

func LoadDivision(tx *pg.Tx, division *Division) (Division, error) {
	var err error

	division.Route, err = GetRouteByDivisionId(tx, division.Id)
	if err != nil {
		return *division, err
	}

	division.Units, err = GetUnitsByDivisionId(tx, division.Id)
	if err != nil {
		return *division, err
	}

	division.VisibleTo, err = GetVisibilityByDivisionId(tx, division.Id)
	return *division, err
}

func LoadDivisions(tx *pg.Tx, divisions []Division) ([]Division, error) {
	for i := range divisions {
		_, err := LoadDivision(tx, &divisions[i])
		if err != nil {
			return nil, err
		}
	}
	return divisions, nil
}

func GetRouteByDivisionId(tx *pg.Tx, divisionId int) ([]Coords, error) {
	var coordses Coordses
	_, err := tx.Query(&coordses, `
             SELECT (c).x, (c).y FROM (
                 SELECT UNNEST(route)::coords AS c
                 FROM division WHERE id = ?
             ) sub
         `, divisionId)
	return coordses, err
}

func GetUnitsByDivisionId(tx *pg.Tx, divisionId int) ([]Unit, error) {
	var units Units
	_, err := tx.Query(&units, `
            SELECT unit.unit_type, unit.amount
		    FROM unit INNER JOIN unit_type ON (unit.unit_type = unit_type.id)
		    WHERE unit.division = ?
        `, divisionId)
	return units, err
}

func GetVisibilityByDivisionId(tx *pg.Tx, divisionId int) ([]int64, error) {
	var ints pg.Ints
	_, err := tx.Query(&ints, `
            SELECT faction_id FROM division_view WHERE division_id = ?
        `, divisionId)
	return ints, err
}
