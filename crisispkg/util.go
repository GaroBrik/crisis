package crisis

func maybePanic(err error) {
	if err != nil {
		panic(err)
	}
}
