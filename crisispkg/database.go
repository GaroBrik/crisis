package crisis

import (
	"gopkg.in/pg.v3"
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
		m_database = &Database{db}
	}
	return m_database
}

func (db *Database) Close() {
	db.db.Close()
}

func DoUnitMovement(tx *pg.Tx) error {
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
			moveLeft := float64(crisis.Speed)
			coordIdx := 0
			for moveLeft > 0 && coordIdx < len(div.Route)-1 {
				curCoords := div.Route[coordIdx]
				curDist := div.Route[coordIdx].distanceTo(&div.Route[coordIdx+1])
				coeff := crisis.MapCosts[curCoords.Y][curCoords.X]
				distToMove := float64(coeff)*curDist - div.TimeSpent
				if distToMove < moveLeft {
					moveLeft -= distToMove
					coordIdx++
					div.TimeSpent = 0
				} else {
					div.TimeSpent = div.TimeSpent + moveLeft
					moveLeft = 0
				}
			}
			stmt.Exec(div.Id, coordIdx+1, div.TimeSpent)
		}
	}

	return nil
}
