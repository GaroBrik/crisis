package crisis

type Faction struct {
	Id   int
	Name string
}

type Factions []Faction

func (factions *Factions) NewRecord() interface{} {
	*factions = append(*factions, Faction{})
	return &(*factions)[len(*factions)-1]
}
