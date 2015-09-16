package crisis

import (
	"database/sql"
	"github.com/lib/pq"
)

func (db *Database) UpdateDivision(divisionId int, units []Unit) {
	tx, err := db.db.Begin()
	if err != nil {
		panic(err)
	}

	_, err = tx.Exec("DELETE FROM unit WHERE unit.division = $1", divisionId)
	if err != nil {
		panic(err)
	}

	stmt, err := tx.Prepare(pq.CopyIn("unit", "division", "unit_type", "amount"))

	for _, unit := range units {
		_, err = stmt.Exec(divisionId, unit.TypeNum, unit.Amount)
		if err != nil {
			panic(err)
		}
	}

	_, err = stmt.Exec()
	if err != nil {
		panic(err)
	}

	err = stmt.Close()
	if err != nil {
		panic(err)
	}

	err = tx.Commit()
	if err != nil {
		panic(err)
	}
}

func (db *Database) GetCrisisDivisions(crisisId int) map[int][]*Division {
	rows, err := db.db.Query("SELECT faction.id, faction.faction_name, division.id, "+
		"division.coord_x, division.coord_y, division.division_name "+
		"FROM division INNER JOIN faction ON (faction.id = division.faction) "+
		"WHERE faction.crisis = $1", crisisId)
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	return db.getCrisisDivisionsFromRows(rows)
}

func (db *Database) GetFactionDivisions(factionId int) []*Division {
	rows, err := db.db.Query("SELECT faction.faction_name, division.id, division.coord_x, "+
		"division.coord_y, division.division_name "+
		"FROM division INNER JOIN faction ON (faction.id = division.faction) "+
		"INNER JOIN division_view ON (division_view.division_id = division.id) "+
		"WHERE division_view.faction_id = $1 ", factionId)
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	return db.getFactionDivisionsFromRows(rows)
}

func (db *Database) getCrisisDivisionsFromRows(rows *sql.Rows) map[int][]*Division {
	m := make(map[int][]*Division)
	var facId int
	for rows.Next() {
		div := Division{}
		err := rows.Scan(&facId, &div.FacName, &div.Id, &div.CoordX, &div.CoordY, &div.DivName)
		if err != nil {
			panic(err)
		}
		db.loadUnitsFor(&div)
		m[facId] = append(m[facId], &div)
	}
	return m
}

func (db *Database) getFactionDivisionsFromRows(rows *sql.Rows) []*Division {
	var fs []*Division
	for rows.Next() {
		div := Division{}
		err := rows.Scan(&div.FacName, &div.Id, &div.CoordX, &div.CoordY, &div.DivName)
		if err != nil {
			panic(err)
		}
		db.loadUnitsFor(&div)
		fs = append(fs, &div)
	}
	return fs
}

func (db *Database) loadUnitsFor(div *Division) {
	rows, err := db.db.Query("SELECT unit_type.unit_name, unit_type.id, unit.amount, unit_type.unit_speed "+
		"FROM unit INNER JOIN unit_type ON (unit.unit_type = unit_type.id) "+
		"WHERE unit.division = $1", div.Id)
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	var speed int

	minSpeed := 1<<16 - 1
	div.Units = make([]Unit, 0)
	for rows.Next() {
		unit := Unit{}
		err = rows.Scan(&unit.TypeName, &unit.TypeNum, &unit.Amount, &speed)
		if err != nil {
			panic(err)
		}
		div.Units = append(div.Units, unit)
		if speed < minSpeed {
			minSpeed = speed
		}
	}
	div.Speed = minSpeed
}
