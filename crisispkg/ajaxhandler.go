package crisis

import (
	"encoding/json"
	"net/http"
)

type AjaxHandler struct {
	db *Database
}

type MapDataJson struct {
	divisions DivisionJson
	mapHeight int
	mapWidth  int
}

var m_ajaxHandler *AjaxHandler

func GetAjaxHandlerInstance() *AjaxHandler {
	if m_ajaxHandler == nil {
		m_ajaxHandler = &AjaxHandler{GetDatabaseInstance()}
	}
	return m_ajaxHandler
}

func (handler *AjaxHandler) HandleRequest(w http.ResponseWriter, r *http.Request) {
	requestPath := getRequestPath(r)
	w.Header().Set("Content-Type", "application/json")

	crisisId := getCrisisId(r)
	canEdit := getCanEdit(r)
	factionId := getFactionId(r)

	switch requestPath {
	case "getMapData":
		var divisions []*Division
		if canEdit {
			for _, divs := range handler.db.GetCrisisDivisions(crisisId) {
				for _, div := range divs {
					divisions = append(divisions, div)
				}
			}
		} else {
			divisions = handler.db.GetFactionDivisions(factionId)
		}

		json, err := json.Marshal(MapDataJson{divisions, 10, 10})
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Write(json)

	default:
		http.Error(w, "Invalid request path", http.StatusBadRequest)
	}
}

func getRequestPath(r *http.Request) string {
	return "getMapData"
}

func getCrisisId(r *http.Request) int {
	return 1
}

func getCanEdit(r *http.Request) bool {
	return true
}

func getFactionId(r *http.Request) int {
	return 1
}
