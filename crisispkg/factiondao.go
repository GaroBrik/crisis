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
    _, err := tx.Exec(`UPDATE
}
