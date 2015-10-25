package crisis

import (
	"gopkg.in/pg.v3"
)

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

func CreateFaction(tx *pg.Tx, name string, crisisId int) (Faction, error) {
	fac := Faction{Name: name}
	_, err := tx.QueryOne(&fac, `
            INSERT INTO faction (faction_name, crisis) 
            VALUES (?, ?) RETURNING id
        `, fac.Name, crisisId)
	return fac, err
}

func UpdateFaction(tx *pg.Tx, factionId int, newName string) (Faction, error) {
	var faction Faction
	_, err := tx.Exec(`UPDATE faction SET faction_name = ? WHERE id = ?`,
		newName, factionId)
	if err != nil {
		return faction, err
	}

	_, err = tx.QueryOne(&faction, `
            SELECT id, faction_name FROM faction WHERE id = ?
        `, factionId)
	return faction, err
}

func DeleteFaction(tx *pg.Tx, factionId int) error {
	_, err := tx.Exec(`DELETE FROM faction WHERE id = ?`, factionId)
	return err
}
