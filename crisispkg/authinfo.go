package crisis

type AuthInfo struct {
	CrisisId int
}

func AuthInfoOf(request *http.Request) AuthInfo {
	return AuthInfo{1}
}
