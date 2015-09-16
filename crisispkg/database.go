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
