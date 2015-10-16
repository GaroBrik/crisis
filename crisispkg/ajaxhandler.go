package crisis

import (
	"encoding/json"
	"gopkg.in/pg.v3"
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
	deleteDivisionPath = ajaxPath + "deleteDivision/"
	divisionRoutePath  = ajaxPath + "divisionRoute/"
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
		var divisions []Division
		if canEdit {
			err := handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
				divMap, err := GetCrisisDivisions(tx, authInfo.CrisisId)
				if err != nil {
					return err
				}

				for _, divs := range divMap {
					for _, div := range divs {
						divisions = append(divisions, div)
					}
				}
				return nil
			})
			maybePanic(err)
		} else {
			err := handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
				divs, err := GetFactionDivisions(tx, factionId)
				if err != nil {
					return err
				}

				divisions = divs
				return nil
			})
			maybePanic(err)
		}

		json, err := json.Marshal(Crisis{Bounds{100, 100}, make([][]int, 0), divisions})
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}

		res.Write(json)

	case updateDivisionPath:
		type UpdateDivisionJson struct {
			Id           int
			Units        []Unit
			DivisionName *string
			FactionId    *int
		}
		var jsonSent UpdateDivisionJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		var newDiv Division
		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			err = UpdateDivision(tx, jsonSent.Id, jsonSent.Units,
				jsonSent.DivisionName, jsonSent.FactionId)
			if err != nil {
				return err
			}

			div, err := GetDivision(tx, jsonSent.Id)
			if err != nil {
				return err
			}

			newDiv = div
			return nil
		})
		maybePanic(err)

		json, err := json.Marshal(newDiv)
		maybePanic(err)

		res.Write(json)

	case createDivisionPath:
		type CreateDivisionJson struct {
			Coords       Coords
			Units        []Unit
			DivisionName string
			FactionId    int
		}
		var jsonSent CreateDivisionJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		var newDiv Division
		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			id, err := CreateDivision(tx, jsonSent.Coords, jsonSent.Units,
				jsonSent.DivisionName, jsonSent.FactionId)
			if err != nil {
				return err
			}

			div, err := GetDivision(tx, id)
			if err != nil {
				return err
			}

			newDiv = div
			return nil
		})
		maybePanic(err)

		json, err := json.Marshal(newDiv)
		maybePanic(err)

		res.Write(json)

	case deleteDivisionPath:
		type DeleteDivisionJson struct {
			DivisionId int
		}
		var jsonSent DeleteDivisionJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			return DeleteDivision(tx, jsonSent.DivisionId)
		})
		maybePanic(err)

	case divisionRoutePath:
		type DivisionRouteJson struct {
			Route      []Coords
			DivisionId int
		}
		var jsonSent DivisionRouteJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		var success bool

		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {

			div, err := GetDivision(tx, jsonSent.DivisionId)
			if err != nil {
				return err
			}
			costs, err := GetCrisisMap(tx, authInfo.CrisisId)
			if err != nil {
				return err
			}

			route := make([]Coords, 0, len(jsonSent.Route))
			route = append(route, div.Coords)
			route = append(route, jsonSent.Route...)

			computedRoute, valid := computeFullPath(route, costs)

			if valid {
				UpdateDivisionRoute(tx, div.Id, computedRoute)
				success = true
			}
			return nil
		})
		maybePanic(err)

		resp := struct{ Success bool }{success}

		json, err := json.Marshal(resp)
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
