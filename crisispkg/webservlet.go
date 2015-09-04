package crisis

import (
	"html/template"
	"net/http"
)

type servlet func(http.ResponseWriter, *http.Request)

const (
	htmlPath = "webcontent/html/"
	jsPath   = "webcontent/js/"
)

type unitType struct {
	Id   int
	Name string
}

type headInfo struct {
	JSUri string
	Types []unitType
}

var headerTmpl *template.Template
var footerTmpl *template.Template
var staffPageTmpl *template.Template
var err error

func StartListening() {
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
		//authInfo := GetAuthInfoOf(req)
		headerTmpl.Execute(res, headInfo{})
		handler(res, req)
		footerTmpl.Execute(res, nil)
	})
}

func staffPage(res http.ResponseWriter, req *http.Request) {
	divisions := GetDatabaseInstance().GetCrisisDivisions(1)
	staffPageTmpl.Execute(res, divisions)
}
