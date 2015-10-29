package crisis

import (
	"gopkg.in/pg.v3"
	"net/http"
	"strings"
)

type AuthInfo struct {
	CrisisId int
	CanEdit  bool
	ViewAs   *int
}

func AuthInfoOf(tx *pg.Tx, request *http.Request) (*AuthInfo, error) {
	authInfo := AuthInfo{}
	authInfo.CrisisId = 1
	authInfo.CanEdit = !strings.Contains(request.URL.Path, "view")
	if !authInfo.CanEdit {
		val, ok := request.URL.Query()["as"]
		if !ok {
			authInfo.ViewAs = nil
		} else {
			fac, err := GetFactionByName(tx, authInfo.CrisisId, val[0])
			if err != nil {
				return nil, err
			}

			authInfo.ViewAs = &fac.Id
		}
	}

	return &authInfo, nil
}
