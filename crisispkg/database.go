package crisis

import (
	"errors"
	"gopkg.in/pg.v3"
	"log"
	"os"
)

const (
	DB_USER_ENV     = "OPENSHIFT_POSTGRESQL_DB_USERNAME"
	DB_PASSWORD_ENV = "OPENSHIFT_POSTGRESQL_DB_PASSWORD"
	DB_HOST_ENV     = "OPENSHIFT_POSTGRESQL_DB_HOST"
	DB_PORT_ENV     = "OPENSHIFT_POSTGRESQL_DB_PORT"
	DB_NAME         = "crisis"
	USE_SSL         = false
)

type Database struct {
	db *pg.DB
}

var m_database *Database

func GetDatabaseInstance() *Database {
	if m_database == nil {
		db := pg.Connect(&pg.Options{
			User:     os.Getenv(DB_USER_ENV),
			Password: os.Getenv(DB_PASSWORD_ENV),
			Port:     os.Getenv(DB_PORT_ENV),
			Host:     os.Getenv(DB_HOST_ENV),
			Database: DB_NAME,
			SSL:      USE_SSL,
		})
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

func GetCrisisMap(tx *pg.Tx, crisisId int) ([][]int, error) {
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

func GetCrisisUnitTypes(tx *pg.Tx, crisisId int) ([]UnitType, error) {
	var unitTypes UnitTypes
	_, err := tx.Query(&unitTypes, `
            SELECT unit_name, id FROM unit_type WHERE crisis = ?
        `, crisisId)
	if err != nil {
		return nil, err
	}

	return unitTypes, nil
}

func GetCrisisFactions(tx *pg.Tx, crisisId int) ([]Faction, error) {
	var factions Factions
	_, err := tx.Query(&factions, `
            SELECT id, faction_name FROM faction WHERE crisis = ?
        `, crisisId)
	if err != nil {
		return nil, err
	}

	return factions, nil
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
