package crisis

import (
	"gopkg.in/pg.v3"
	"html/template"
	"log"
	"net/http"
	"time"
)

type servlet func(http.ResponseWriter, *http.Request)

const (
	staticPath = "static/"
	htmlPath   = "webcontent/html/"
)

type headInfo struct {
	CanEdit  bool
	JSUrl    string
	CSSUrl   string
	Types    []UnitType
	Factions []Faction
}

var headerTmpl *template.Template
var footerTmpl *template.Template
var staffPageTmpl *template.Template
var err error

func StartListening() {
	staticServer := http.FileServer(http.Dir(staticPath))
	http.Handle("/static/", http.StripPrefix("/static/", staticServer))

	ajaxHandler := GetAjaxHandlerInstance()
	http.HandleFunc("/ajax/", func(w http.ResponseWriter, r *http.Request) {
		ajaxHandler.HandleRequest(w, r)
	})

	if headerTmpl, err = template.ParseFiles(htmlPath + "head.gohtml"); err != nil {
		panic(err)
	}
	if staffPageTmpl, err = template.ParseFiles(htmlPath + "staff.gohtml"); err != nil {
		panic(err)
	}
	if footerTmpl, err = template.ParseFiles(htmlPath + "foot.gohtml"); err != nil {
		panic(err)
	}

	wrapAndListen("/staff", staffPage)
	wrapAndListen("/view", staffPage)

	go MoveDivisions()
}

func MoveDivisions() {
	for {
		time.Sleep(10 * time.Second)
		err := GetDatabaseInstance().db.RunInTransaction(func(tx *pg.Tx) error {
			return DoUnitMovement(tx)
		})
		if err != nil {
			log.Println(err)
		}
	}
}

func wrapAndListen(path string, handler servlet) {
	http.HandleFunc(path, func(res http.ResponseWriter, req *http.Request) {
		authInfo := AuthInfoOf(req)
		err := GetDatabaseInstance().db.RunInTransaction(func(tx *pg.Tx) error {
			types, err := GetUnitTypesByCrisisId(tx, authInfo.CrisisId)
			if err != nil {
				return err
			}
			facs, err := GetFactionsByCrisisId(tx, authInfo.CrisisId)
			if err != nil {
				return err
			}
			return headerTmpl.Execute(res, headInfo{
				JSUrl:    "static/compiled.js",
				CSSUrl:   "static/main.css",
				Types:    types,
				Factions: facs,
				CanEdit:  authInfo.CanEdit,
			})

		})
		maybePanic(err)

		handler(res, req)
		err = footerTmpl.Execute(res, nil)
		maybePanic(err)
	})
}

func staffPage(res http.ResponseWriter, req *http.Request) {
	authInfo := AuthInfoOf(req)
	err = GetDatabaseInstance().db.RunInTransaction(func(tx *pg.Tx) error {
		divisions, err := GetDivisionsByCrisisId(tx, authInfo.CrisisId)
		if err != nil {
			return err
		}

		return staffPageTmpl.Execute(res, divisions)
	})
	maybePanic(err)
}
