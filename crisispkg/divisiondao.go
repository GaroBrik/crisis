package crisis

import (
	"database/sql"
	"github.com/lib/pq"
)

func (db *Database) CreateDivision(coords Coords, units []Unit, name string, factionId int) int {
	tx, err := db.db.Begin()
	if err != nil {
		panic(err)
	}

	row := tx.QueryRow("INSERT INTO division (faction, division_name, route) "+
		"VALUES($1, $2, ARRAY[($3, $4)]) RETURNING id", factionId, name, coords.X, coords.Y)

	var divisionId int
	err = row.Scan(&divisionId)
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

	return divisionId
}

func (db *Database) UpdateDivision(divisionId int, units []Unit, name *string) {
	tx, err := db.db.Begin()
	if err != nil {
		panic(err)
	}

	if name != nil {
		_, err = tx.Query("UPDATE division SET name = $1 WHERE id = $2", name, divisionId)
		if err != nil {
			panic(err)
		}
	}

	_, err = tx.Query("DELETE FROM unit WHERE unit.division = $1", divisionId)
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
	rows, err := db.db.Query("SELECT division.id, "+
		"division.route[1].x, division.route[1].y, division.division_name, faction.id "+
		"FROM division INNER JOIN faction ON (faction.id = division.faction) "+
		"WHERE faction.crisis = $1", crisisId)
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	return db.getCrisisDivisionsFromRows(rows)
}

func (db *Database) GetFactionDivisions(factionId int) []*Division {
	rows, err := db.db.Query("SELECT division.id, division.route[1].x, "+
		"division.route[1].y, division.division_name, faction.id "+
		"FROM division INNER JOIN faction ON (faction.id = division.faction) "+
		"INNER JOIN division_view ON (division_view.division_id = division.id) "+
		"WHERE division_view.faction_id = $1 ", factionId)
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	return db.getDivisionsFromRows(rows)
}

func (db *Database) getCrisisDivisionsFromRows(rows *sql.Rows) map[int][]*Division {
	m := make(map[int][]*Division)
	for rows.Next() {
		div := Division{}
		coords := Coords{}
		err := rows.Scan(&div.Id, &coords.X, &coords.Y, &div.Name, &div.FactionId)
		if err != nil {
			panic(err)
		}
		div.Coords = coords
		db.loadUnitsFor(&div)
		m[div.FactionId] = append(m[div.FactionId], &div)
	}
	return m
}

func (db *Database) getDivisionsFromRows(rows *sql.Rows) []*Division {
	var fs []*Division
	for rows.Next() {
		div := Division{}
		coords := Coords{}
		err := rows.Scan(&div.Id, &coords.X, &coords.Y, &div.Name, &div.FactionId)
		if err != nil {
			panic(err)
		}
		div.Coords = coords
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
