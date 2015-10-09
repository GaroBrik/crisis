package crisis

import (
	"database/sql"
	"errors"
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

func (db *Database) GetCrisisMap(crisisId int) *[][]int {
	tx, err := db.db.Begin()
	maybePanic(err)

	var height int
	var width int
	row := tx.QueryRow("SELECT array_length(map_costs, 1), "+
		"array_length(map_costs, 2) FROM crisis WHERE id = $1", crisisId)
	err = row.Scan(&height, &width)
	maybePanic(err)

	rows, err := tx.Query(
		"SELECT UNNEST(map_costs) FROM crisis WHERE id = $1", crisisId)
	maybePanic(err)

	result := make([][]int, height)
	for i := 0; i < height; i++ {
		result[i] = make([]int, width)
		for j := 0; j < width; j++ {
			if !rows.Next() {
				panic(errors.New("number of elements in map cost did " +
					"not match bounds"))
			}
			err = rows.Scan(&(result[i][j]))
			maybePanic(err)
		}
	}

	err = tx.Commit()
	maybePanic(err)

	return &result
}

func (db *Database) GetCrisisUnitTypes(crisisId int) []*UnitType {
	rows, err := db.db.Query("SELECT unit_name, id FROM unit_type "+
		"WHERE crisis = $1", crisisId)
	maybePanic(err)
	defer rows.Close()

	types := make([]*UnitType, 0)
	for rows.Next() {
		utype := UnitType{}
		err = rows.Scan(&utype.Name, &utype.Id)
		maybePanic(err)
		types = append(types, &utype)
	}
	return types
}

func (db *Database) GetCrisisFactions(crisisId int) []*Faction {
	rows, err := db.db.Query("SELECT id, faction_name FROM faction WHERE crisis = $1", crisisId)
	maybePanic(err)

	defer rows.Close()

	factions := make([]*Faction, 0)
	for rows.Next() {
		faction := Faction{}
		err = rows.Scan(&faction.Id, &faction.Name)
		maybePanic(err)
		factions = append(factions, &faction)
	}
	return factions
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
