package crisis

import (
	"encoding/json"
	"net/http"
)

type AjaxHandler struct {
	db *Database
}

const (
	ajaxPath           = "ajax/"
	mapPath            = ajaxPath + "map/"
	updateDivisionPath = ajaxPath + "updateDivision/"
	createDivisionPath = ajaxPath + "createDivision/"
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
			Id    int
			Units []Unit
			Name  *string
		}
		var jsonSent UpdateDivisionJson
		json.NewDecoder(req.Body).Decode(&jsonSent)

		handler.db.UpdateDivision(jsonSent.Id, jsonSent.Units, jsonSent.Name)

	case createDivisionPath:
		type CreateDivisionJson struct {
			Coords    Coords
			Units     []Unit
			Name      string
			FactionId int
		}
		var jsonSent CreateDivisionJson
		json.NewDecoder(req.Body).Decode(&jsonSent)

		id := handler.db.CreateDivision(
			jsonSent.Coords, jsonSent.Units, jsonSent.Name, jsonSent.FactionId)

		div := handler.db.GetDivision(id)

		json, err := json.Marshal(div)
		maybePanic(err)

		res.Write(json)

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
