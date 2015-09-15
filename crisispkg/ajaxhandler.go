package crisis

import (
	"encoding/json"
	"net/http"
)

type AjaxHandler struct {
	db *Database
}

var m_ajaxHandler *AjaxHandler

func GetAjaxHandlerInstance() *AjaxHandler {
	if m_ajaxHandler == nil {
		m_ajaxHandler = &AjaxHandler{GetDatabaseInstance()}
	}
	return m_ajaxHandler
}

func (handler *AjaxHandler) HandleRequest(res http.ResponseWriter, req *http.Request) {
	requestPath := getRequestPath(req)
	res.Header().Set("Content-Type", "application/json")

	authInfo := AuthInfoOf(req)
	canEdit := getCanEdit(req)
	factionId := getFactionId(req)

	switch requestPath {
	case "getMapData":
		var divisions []*Division
		if canEdit {
			for _, divs := range handler.db.GetCrisisDivisions(authInfo.CrisisId) {
				for _, div := range divs {
					divisions = append(divisions, div)
				}
			}
		} else {
			divisions = handler.db.GetFactionDivisions(factionId)
		}

		json, err := json.Marshal(Crisis{Bounds{100, 100}, make([][]int, 0), divisions})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		res.Write(json)

	default:
		http.Error(w, "Invalid request path", http.StatusBadRequest)
	}
}

func getRequestPath(req *http.Request) string {
	return "getMapData"
}

func getCanEdit(req *http.Request) bool {
	return true
}

func getFactionId(req *http.Request) int {
	return 1
}
