package crisis

import (
	"github.com/lib/pq"
	"gopkg.in/pg.v3"
)

const (
	divisionInfoSelector = ` 
        division.id, division.division_name, division.faction, 
		division.route[1].x, division.route[1].y`
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

	err = UpdateDivisionUnits(tx, div.Id, div.Units)
	return div.Id, err
}

func UpdateDivision(tx *pg.Tx, divisionId int, units []Unit,
	name *string, factionId *int) error {

	if name != nil {
		_, err = tx.Exec(`
                UPDATE division SET division_name = ? WHERE id = ?
            `, name, divisionId)
		if err != nil {
			return err
		}
	}
	if factionId != nil {
		_, err = tx.Exec(`
                 UPDATE division SET faction = ? WHERE id = ?
           `, factionId, divisionId)
		if err != nil {
			return err
		}
	}

	err := UpdateDivisionUnits(tx, divisionId, units)
	return err
}

func UpdateDivisionUnits(tx *pg.Tx, divisionId int, units []Unit) error {
	_, err = tx.Exec(`
            DELETE FROM unit WHERE unit.division = ?
        `, divisionId)
	if err != nil {
		return err
	}

	stmt, err := tx.Prepare(pq.CopyIn(
		`unit`, `division`, `unit_type`, `amount`))
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
	_, err := tx.Exec(`UPDATE division SET route = {?}::coords[] WHERE id = ?`,
		Coordses(route), divisionId)
	return err
}

func DeleteDivision(tx *pg.Tx, divisionId int) error {
	_, err := tx.Exec(`DELETE FROM division WHERE id = ?`, divisionId)
	return err
}

func GetDivision(tx *pg.Tx, divisionId int) (Division, error) {
	div := Division{}
	_, err := tx.QueryOne(div.GetColumnLoader(), `
            SELECT `+divisionInfoSelector+` 
            FROM division WHERE division.id = ?
        `, divisionId)
	if err != nil {
		return div, err
	}

	units, err := GetUnits(tx, divisionId)
	if err != nil {
		return div, err
	}

	div.Units = units

	return div, nil
}

func GetCrisisDivisions(tx *pg.Tx, crisisId int) (map[int][]Division, error) {
	var divs Divisions
	_, err := tx.Query(&divs, `
            SELECT `+divisionInfoSelector+` 
            FROM division INNER JOIN faction ON (faction.id = division.faction)
		    WHERE faction.crisis = ?
        `, crisisId)
	if err != nil {
		return nil, err
	}

	mp := make(map[int][]Division)
	for _, div := range divs {
		units, err := GetUnits(tx, div.Id)
		if err != nil {
			return nil, err
		}
		div.Units = units
		mp[div.FactionId] = append(mp[div.FactionId], div)
	}

	return mp, nil
}

func GetFactionDivisions(tx *pg.Tx, factionId int) ([]Division, error) {
	var divs Divisions
	_, err := tx.Query(&divs, `
            SELECT `+divisionInfoSelector+` 
            FROM division WHERE faction = ?`, factionId)
	if err != nil {
		return nil, err
	}

	for _, div := range divs {
		units, err := GetUnits(tx, div.Id)
		if err != nil {
			return nil, err
		}
		div.Units = units
	}

	return divs, nil
}

func GetUnits(tx *pg.Tx, divisionId int) ([]Unit, error) {
	var units Units
	_, err := tx.Query(&units, `
            SELECT unit.unit_type, unit.amount
		    FROM unit INNER JOIN unit_type ON (unit.unit_type = unit_type.id)
		    WHERE unit.division = ?
        `, divisionId)
	return units, err
}
