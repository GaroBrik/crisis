package crisis

import (
	"encoding/json"
	"log"
	"net/http"
)

type AjaxHandler struct {
	db *Database
}

const (
	ajaxPath           = "ajax/"
	mapPath            = ajaxPath + "map/"
	updateDivisionPath = ajaxPath + "updateDivision/"
)

var m_ajaxHandler *AjaxHandler

func GetAjaxHandlerInstance() *AjaxHandler {
	if m_ajaxHandler == nil {
		m_ajaxHandler = &AjaxHandler{GetDatabaseInstance()}
	}
	return m_ajaxHandler
}

func (handler *AjaxHandler) HandleRequest(res http.ResponseWriter, req *http.Request) {
	res.Header().Set("Content-Type", "application/json")

	authInfo := AuthInfoOf(req)
	canEdit := getCanEdit(req)
	factionId := getFactionId(req)

	switch req.URL.Path[1:] {
	case mapPath:
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
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}

		res.Write(json)

	case updateDivisionPath:
		type UpdateDivisionJson struct {
			DivId int
			Units []Unit
		}
		var jsonSent UpdateDivisionJson
		log.Println(req.Body)
		//json.NewDecoder(req.Body).Decode(&jsonSent)

		handler.db.UpdateDivision(jsonSent.DivId, jsonSent.Units)

	default:
		http.Error(res, "Invalid request path", http.StatusBadRequest)
	}
}

func getCanEdit(req *http.Request) bool {
	return true
}

func getFactionId(req *http.Request) int {
	return 1
}
