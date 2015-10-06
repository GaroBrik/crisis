package crisis

import (
	"html/template"
	"net/http"
)

type servlet func(http.ResponseWriter, *http.Request)

const (
	staticPath = "static/"
	htmlPath   = "webcontent/html/"
)

type headInfo struct {
	JSUrl    string
	CSSUrl   string
	Types    []*UnitType
	Factions []*Faction
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
}

func wrapAndListen(path string, handler servlet) {
	http.HandleFunc(path, func(res http.ResponseWriter, req *http.Request) {
		authInfo := AuthInfoOf(req)
		headerTmpl.Execute(res, headInfo{
			JSUrl:    "static/compiled.js",
			CSSUrl:   "static/main.css",
			Types:    GetDatabaseInstance().GetCrisisUnitTypes(authInfo.CrisisId),
			Factions: GetDatabaseInstance().GetCrisisFactions(authInfo.CrisisId),
		})
		handler(res, req)
		footerTmpl.Execute(res, nil)
	})
}

func staffPage(res http.ResponseWriter, req *http.Request) {
	authInfo := AuthInfoOf(req)
	divisions := GetDatabaseInstance().GetCrisisDivisions(authInfo.CrisisId)
	staffPageTmpl.Execute(res, divisions)
}
