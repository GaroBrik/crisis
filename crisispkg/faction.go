package crisis

type Faction struct {
	Id          int
	FactionName string
}

type Factions []Faction

func (factions *Factions) NewRecord() interface{} {
	*factions = append(*factions, Faction{})
	return &(*factions)[len(*factions)-1]
}
