package crisis

import (
	"fmt"
	"html/template"
	"net/http"
	"runtime"
)

type servlet func(http.ResponseWriter, *http.Request)

var headerTmpl *template.Template
var footerTmpl *template.Template
var staffPageTmpl *template.Template
var err error

func Serve() {
	http.HandleFunc("/", hello)
}

func hello(res http.ResponseWriter, req *http.Request) {
	fmt.Fprintf(res, "hello, world from %s", runtime.Version())
}
func test(res http.ResponseWriter, req *http.Request) {
	testTmpl, err := template.ParseFiles("html/test.gohtml")
	if err != nil {
		panic(err)
	}
	testTmpl.Execute(res, nil)
}

func StartListening() {
	if headerTmpl, err = template.ParseFiles("html/head.gohtml"); err != nil {
		panic(err)
	}
	if staffPageTmpl, err = template.ParseFiles("html/staff.gohtml"); err != nil {
		panic(err)
	}
	if footerTmpl, err = template.ParseFiles("html/foot.gohtml"); err != nil {
		panic(err)
	}

	wrapAndListen("/staff", staffPage)
}

func wrapAndListen(path string, handler servlet) {
	http.HandleFunc(path, func(res http.ResponseWriter, req *http.Request) {
		//authInfo := GetAuthInfoOf(req)
		headerTmpl.Execute(res, 1)
		handler(res, req)
		footerTmpl.Execute(res, 1)
	})
}

func staffPage(res http.ResponseWriter, req *http.Request) {
	divisions := GetDatabaseInstance().GetCrisisDivisions(1)
	staffPageTmpl.Execute(res, divisions)
}
