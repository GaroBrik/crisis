package crisis

type Map struct {
	Bounds    Bounds      `json:"bounds"`
	Divisions []*Division `json:"divisions"`
}
