package crisis

import (
	"gopkg.in/pg.v3"
)

const (
	unitTypeSelector = ` id, unit_name, speed `
)

func GetUnitTypesByCrisisId(tx *pg.Tx, crisisId int) ([]UnitType, error) {
	var unitTypes UnitTypes
	_, err := tx.Query(&unitTypes, `
            SELECT `+unitTypeSelector+` FROM unit_type WHERE crisis = ?
        `, crisisId)
	if err != nil {
		return nil, err
	}

	return unitTypes, nil
}

func CreateUnitType(tx *pg.Tx, name string, speed float64,
	crisisId int) (UnitType, error) {
	utype := UnitType{Name: name}
	_, err := tx.QueryOne(&utype, `
            INSERT INTO unit_type (unit_name, speed, crisis) 
            VALUES (?, ?, ?) RETURNING id
        `, utype.Name, speed, crisisId)
	return utype, err
}

func UpdateUnitType(tx *pg.Tx, typeId int, newName string,
	newSpeed float64) (UnitType, error) {
	var unitType UnitType
	_, err := tx.Exec(`
            UPDATE unit_type SET unit_name = ?, speed = ? WHERE id = ?
        `, newName, newSpeed, typeId)
	if err != nil {
		return unitType, err
	}

	_, err = tx.QueryOne(&unitType, `
            SELECT `+unitTypeSelector+` FROM unit_type WHERE id = ?
        `, typeId)
	return unitType, err
}

func DeleteUnitType(tx *pg.Tx, typeId int) error {
	_, err := tx.Exec(`DELETE FROM unit_type WHERE id = ?`, typeId)
	return err
}
