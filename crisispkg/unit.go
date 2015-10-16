package crisis

type Unit struct {
	Type   int
	Amount int
}

type Units []Unit

func (units *Units) NewRecord() interface{} {
	*units = append(*units, Unit{})
	return (*units)[len(*units)-1]
}
