package crisis

import (
	"encoding/json"
	"gopkg.in/pg.v3"
	"net/http"
)

type AjaxHandler struct {
	db *Database
}

type SuccessResponse struct {
	Success bool
	Message string
}

const (
	ajaxPath                     = "ajax/"
	crisisPath                   = ajaxPath + "crisis/"
	updateDivisionPath           = ajaxPath + "updateDivision/"
	updateDivisionVisibilityPath = ajaxPath + "updateDivisionVisibility/"
	createDivisionPath           = ajaxPath + "createDivision/"
	deleteDivisionPath           = ajaxPath + "deleteDivision/"
	updateFactionPath            = ajaxPath + "updateFaction/"
	createFactionPath            = ajaxPath + "createFaction/"
	deleteFactionPath            = ajaxPath + "deleteFaction/"
	updateUnitTypePath           = ajaxPath + "updateUnitType/"
	createUnitTypePath           = ajaxPath + "createUnitType/"
	deleteUnitTypePath           = ajaxPath + "deleteUnitType/"
	divisionRoutePath            = ajaxPath + "divisionRoute/"
	updateCrisisSpeedPath        = ajaxPath + "updateCrisisSpeed/"
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

	var authInfo *AuthInfo
	err := handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
		authInfoP, err := AuthInfoOf(tx, req)
		authInfo = authInfoP
		return err
	})
	maybePanic(err)

	switch req.URL.Path[1:] {
	case crisisPath:
		type CrisisRequestJson struct {
			CanEdit bool
			ViewAs  int
		}
		var jsonSent CrisisRequestJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		var divisions []Division
		var unitTypes []UnitType
		var factions []Faction
		var speed int
		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			var err error
			if jsonSent.CanEdit {
				divisions, err = GetDivisionsByCrisisId(tx, authInfo.CrisisId)
			} else {
				divisions, err = GetDivisionsForFactionId(tx, jsonSent.ViewAs)
			}
			if err != nil {
				return err
			}

			unitTypes, err = GetUnitTypesByCrisisId(tx, authInfo.CrisisId)
			if err != nil {
				return err
			}

			factions, err = GetFactionsByCrisisId(tx, authInfo.CrisisId)
			if err != nil {
				return err
			}

			crisis, err := GetCrisisById(tx, authInfo.CrisisId)
			speed = crisis.Speed
			return err
		})
		maybePanic(err)

		json, err := json.Marshal(Crisis{
			MapBounds: Bounds{100, 100},
			MapCosts:  make([][]int, 0),
			Divisions: divisions,
			Factions:  factions,
			UnitTypes: unitTypes,
			Speed:     speed,
		})
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}

		res.Write(json)

	case updateDivisionPath:
		type UpdateDivisionJson struct {
			Id        int
			Units     []Unit
			Name      *string
			FactionId *int
		}
		var jsonSent UpdateDivisionJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		var newDiv Division
		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			err = UpdateDivision(tx, jsonSent.Id, jsonSent.Units,
				jsonSent.Name, jsonSent.FactionId)
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

	case updateDivisionVisibilityPath:
		type DivisionVisibilityUpdateJson struct {
			DivisionId int
			VisibleTo  []int
		}
		var jsonSent DivisionVisibilityUpdateJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		var newDiv Division
		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			err = UpdateDivisionVisibility(
				tx, jsonSent.DivisionId, jsonSent.VisibleTo)
			if err != nil {
				return err
			}

			div, err := GetDivision(tx, jsonSent.DivisionId)
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
			Coords    Coords
			Units     []Unit
			Name      string
			FactionId int
		}
		var jsonSent CreateDivisionJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		var newDiv Division
		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			id, err := CreateDivision(tx, jsonSent.Coords, jsonSent.Units,
				jsonSent.Name, jsonSent.FactionId)
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
			costs, err := GetMapCostsByCrisisId(tx, authInfo.CrisisId)
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

		resp := SuccessResponse{Success: success}

		json, err := json.Marshal(resp)
		maybePanic(err)

		res.Write(json)

	case createFactionPath:
		type CreateFactionJson struct {
			Name  string
			Color string
		}
		var jsonSent CreateFactionJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		var finalFaction *Faction
		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			fac, err := CreateFaction(tx, jsonSent.Name, jsonSent.Color, authInfo.CrisisId)
			if err != nil {
				return err
			}

			finalFaction = &fac
			return nil
		})
		maybePanic(err)

		json, err := json.Marshal(finalFaction)
		maybePanic(err)

		res.Write(json)

	case updateFactionPath:
		var jsonSent Faction
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		var finalFaction *Faction
		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			fac, err := UpdateFaction(
				tx, jsonSent.Id, jsonSent.Name, jsonSent.Color)
			if err != nil {
				return err
			}

			finalFaction = &fac
			return nil
		})
		maybePanic(err)

		json, err := json.Marshal(finalFaction)
		maybePanic(err)

		res.Write(json)

	case deleteFactionPath:
		type DeleteFactionJson struct{ Id int }
		var jsonSent DeleteFactionJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			err := DeleteFaction(tx, jsonSent.Id)
			return err
		})
		maybePanic(err)

	case createUnitTypePath:
		type CreateUnitTypeJson struct{ Name string }
		var jsonSent CreateUnitTypeJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		var finalUnitType *UnitType
		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			fac, err := CreateUnitType(tx, jsonSent.Name, authInfo.CrisisId)
			if err != nil {
				return err
			}

			finalUnitType = &fac
			return nil
		})
		maybePanic(err)

		json, err := json.Marshal(finalUnitType)
		maybePanic(err)

		res.Write(json)

	case updateUnitTypePath:
		var jsonSent UnitType
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		var finalUnitType *UnitType
		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			fac, err := UpdateUnitType(tx, jsonSent.Id, jsonSent.Name)
			if err != nil {
				return err
			}

			finalUnitType = &fac
			return nil
		})
		maybePanic(err)

		json, err := json.Marshal(finalUnitType)
		maybePanic(err)

		res.Write(json)

	case deleteUnitTypePath:
		type DeleteUnitTypeJson struct{ Id int }
		var jsonSent DeleteUnitTypeJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			err := DeleteUnitType(tx, jsonSent.Id)
			return err
		})
		maybePanic(err)

	case updateCrisisSpeedPath:
		type UpdateCrisisSpeedJson struct{ Speed int }
		var jsonSent UpdateCrisisSpeedJson
		err := json.NewDecoder(req.Body).Decode(&jsonSent)
		maybePanic(err)

		err = handler.db.db.RunInTransaction(func(tx *pg.Tx) error {
			err := UpdateCrisisSpeed(tx, jsonSent.Speed, authInfo.CrisisId)
			return err
		})
		maybePanic(err)

		json, err := json.Marshal(SuccessResponse{Success: true})
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
