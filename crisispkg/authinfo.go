package crisis

import (
	"net/http"
	"strings"
)

type AuthInfo struct {
	CrisisId int
	CanEdit  bool
}

func AuthInfoOf(request *http.Request) AuthInfo {
	return AuthInfo{
		CrisisId: 1,
		CanEdit:  !strings.Contains(request.URL.Path, "view"),
	}
}
