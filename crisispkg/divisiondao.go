package crisis

import (
	"database/sql"
	"github.com/lib/pq"
)

const (
	divisionInfoSelector = " division.id, division.route[1].x, division.route[1].y, " +
		"division.division_name, division.faction "
)

func (db *Database) CreateDivision(coords Coords, units []Unit, name string, factionId int) int {
	tx, err := db.db.Begin()
	maybePanic(err)

	row := tx.QueryRow("INSERT INTO division (faction, division_name, route) "+
		"VALUES($1, $2, $3) RETURNING id",
		factionId, name, makeDbCoordsArray(&[]*Coords{&coords}))

	var divisionId int
	err = row.Scan(&divisionId)
	maybePanic(err)

	stmt, err := tx.Prepare(pq.CopyIn("unit", "division", "unit_type", "amount"))
	maybePanic(err)

	for _, unit := range units {
		_, err = stmt.Exec(divisionId, unit.TypeNum, unit.Amount)
		maybePanic(err)
	}

	_, err = stmt.Exec()
	maybePanic(err)

	err = stmt.Close()
	maybePanic(err)

	err = tx.Commit()
	maybePanic(err)

	return divisionId
}

func (db *Database) UpdateDivision(divisionId int, units []Unit, name *string, factionId *int) {
	tx, err := db.db.Begin()
	maybePanic(err)

	if name != nil {
		_, err = tx.Exec("UPDATE division SET division_name = $1 WHERE id = $2", name, divisionId)
		maybePanic(err)
	}
	if factionId != nil {
		_, err = tx.Exec("UPDATE division SET faction = $1 WHERE id = $2", factionId, divisionId)
		maybePanic(err)
	}

	_, err = tx.Exec("DELETE FROM unit WHERE unit.division = $1", divisionId)
	maybePanic(err)

	stmt, err := tx.Prepare(pq.CopyIn("unit", "division", "unit_type", "amount"))
	maybePanic(err)

	for _, unit := range units {
		_, err = stmt.Exec(divisionId, unit.TypeNum, unit.Amount)
		maybePanic(err)
	}

	_, err = stmt.Exec()
	maybePanic(err)

	err = stmt.Close()
	maybePanic(err)

	err = tx.Commit()
	maybePanic(err)
}

func (db *Database) UpdateDivisionRoute(divisionId int, route *[]*Coords) {
	_, err := db.db.Exec("UPDATE division SET route = ARRAY[$1]::coords[]"+
		" WHERE id = $2",
		makeDbCoordsArray(route), divisionId)
	maybePanic(err)
}

func (db *Database) DeleteDivision(divisionId int) {
	_, err := db.db.Exec("DELETE FROM division WHERE id = $1", divisionId)
	maybePanic(err)
}

func (db *Database) GetDivision(divisionId int) Division {
	row := db.db.QueryRow("SELECT "+divisionInfoSelector+
		"FROM division WHERE division.id = $1", divisionId)
	div := Division{}
	coords := Coords{}

	err = row.Scan(&div.Id, &coords.X, &coords.Y, &div.Name, &div.FactionId)
	maybePanic(err)

	div.Coords = coords
	db.loadUnitsFor(&div)

	return div
}

func (db *Database) GetCrisisDivisions(crisisId int) map[int][]*Division {
	rows, err := db.db.Query("SELECT "+divisionInfoSelector+
		"FROM division INNER JOIN faction ON (faction.id = division.faction) "+
		"WHERE faction.crisis = $1", crisisId)
	maybePanic(err)

	return db.getCrisisDivisionsFromRows(rows)
}

func (db *Database) GetFactionDivisions(factionId int) []*Division {
	rows, err := db.db.Query("SELECT "+divisionInfoSelector+
		"FROM division INNER JOIN faction ON (faction.id = division.faction) "+
		"INNER JOIN division_view ON (division_view.division_id = division.id) "+
		"WHERE division_view.faction_id = $1 ", factionId)
	maybePanic(err)
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
	maybePanic(err)
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
