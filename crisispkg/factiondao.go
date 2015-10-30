package crisis

import (
	"gopkg.in/pg.v3"
)

const factionSelector = ` id, faction_name, color `

func GetFactionsByCrisisId(tx *pg.Tx, crisisId int) ([]Faction, error) {
	var factions Factions
	_, err := tx.Query(&factions, `
            SELECT `+factionSelector+` FROM faction WHERE crisis = ?
        `, crisisId)
	if err != nil {
		return nil, err
	}

	return factions, nil
}

func GetFactionByName(tx *pg.Tx, crisisId int, name string) (Faction, error) {
	var faction Faction
	_, err := tx.QueryOne(&faction, `
            SELECT `+factionSelector+` FROM faction 
            WHERE lower(faction_name) = lower(?)
        `, name)
	return faction, err
}

func CreateFaction(tx *pg.Tx, name, color string, crisisId int) (Faction, error) {
	fac := Faction{Name: name}
	_, err := tx.QueryOne(&fac, `
            INSERT INTO faction (faction_name, crisis, color) 
            VALUES (?, ?, ?) RETURNING id
        `, fac.Name, crisisId, color)
	return fac, err
}

func UpdateFaction(tx *pg.Tx, factionId int, newName, newColor string) (Faction, error) {
	var faction Faction
	_, err := tx.Exec(`
            UPDATE faction SET faction_name = ?, color = ? WHERE id = ?
        `, newName, newColor, factionId)
	if err != nil {
		return faction, err
	}

	_, err = tx.QueryOne(&faction, `
            SELECT `+factionSelector+` FROM faction WHERE id = ?
        `, factionId)
	return faction, err
}

func DeleteFaction(tx *pg.Tx, factionId int) error {
	_, err := tx.Exec(`DELETE FROM faction WHERE id = ?`, factionId)
	return err
}
