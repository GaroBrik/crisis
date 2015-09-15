package crisis

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"log"
	"os"
)

const (
	DB_USER_ENV     = "OPENSHIFT_POSTGRESQL_DB_USERNAME"
	DB_PASSWORD_ENV = "OPENSHIFT_POSTGRESQL_DB_PASSWORD"
	DB_NAME         = "crisis"
)

type Database struct {
	db *sql.DB
}

var m_database *Database

func GetDatabaseInstance() *Database {
	if m_database == nil {
		dbinfo := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable",
			os.Getenv(DB_USER_ENV), os.Getenv(DB_PASSWORD_ENV), DB_NAME)
		db, err := sql.Open("postgres", dbinfo)
		if err != nil {
			log.Fatal(err)
		}
		m_database = &Database{db}
	}
	return m_database
}

func (db *Database) Close() {
	db.db.Close()
}

func (db *Database) GetCrisisUnitTypes(crisisId int) []*UnitType {
	rows, err := db.db.Query("SELECT unit_name, id FROM unit_type "+
		"WHERE crisis = $1", crisisId)
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	types := make([]*UnitType, 0)
	for rows.Next() {
		utype := UnitType{}
		rows.Scan(&utype.Name, &utype.Id)
		types = append(types, &utype)
	}
	return types
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
	rows, err := db.db.Query("SELECT unit_type.unit_name, unit_type.id, unit.id, unit.amount, unit_type.unit_speed "+
		"FROM unit INNER JOIN unit_type ON (unit.unit_type = unit_type.id)"+
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
		err = rows.Scan(&unit.TypeName, &unit.TypeNum, &unit.Id, &unit.Amount, &speed)
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

// func (db *Database) getAllCrises() {
// 	rows, err := db.db.Query("SELECT * FROM crisis")
// 	if err != nil {
// 		panic(err)
// 	}
// 	var costs
// 	for rows.Next() {

// 	}
// }

// func (db *Database) doUnitMovement() {
// 	for crisis := range db.getAllCrises() {
// 	}
// }
