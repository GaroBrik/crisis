package crisis

import (
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

func GetUnitTypesByCrisisId(tx *pg.Tx, crisisId int) ([]UnitType, error) {
	var unitTypes UnitTypes
	_, err := tx.Query(&unitTypes, `
            SELECT unit_name, id FROM unit_type WHERE crisis = ?
        `, crisisId)
	if err != nil {
		return nil, err
	}

	return unitTypes, nil
}

func GetFactionsByCrisisId(tx *pg.Tx, crisisId int) ([]Faction, error) {
	var factions Factions
	_, err := tx.Query(&factions, `
            SELECT id, faction_name FROM faction WHERE crisis = ?
        `, crisisId)
	if err != nil {
		return nil, err
	}

	return factions, nil
}

func DoUnitMovement(tx *pg.Tx) error {
	moveAmount := 10
	crises, err := GetAllActiveCrises(tx)
	if err != nil {
		return err
	}

	stmt, err := tx.Prepare(`
            UPDATE division SET (route, time_spent) = 
                                (route[$2:array_length(route,1)], $3)
            WHERE id = $1
        `)
	if err != nil {
		return err
	}

	for _, crisis := range crises {
		for _, div := range crisis.Divisions {
			moveLeft := moveAmount
			coordIdx := 0
			for moveLeft > 0 && coordIdx < len(div.Route)-1 {
				curCoords := div.Route[coordIdx]
				curDist := div.Route[coordIdx].distanceTo(&div.Route[coordIdx+1])
				coeff := crisis.MapCosts[curCoords.Y][curCoords.X]
				distToMove := int(float64(coeff)*curDist+0.5) - div.TimeSpent
				if distToMove < moveLeft {
					moveLeft -= distToMove
					coordIdx++
					div.TimeSpent = 0
				} else {
					moveLeft = 0
					div.TimeSpent = distToMove - moveLeft
				}
			}
			stmt.Exec(div.Id, coordIdx+1, div.TimeSpent)
		}
	}

	return nil
}
