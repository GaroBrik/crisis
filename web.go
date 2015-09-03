package main

import (
	"fmt"
	"github.com/garobrik/crisis/crisispkg"
	"net/http"
	"os"
)

func main() {
	crisis.Serve()
	bind := fmt.Sprintf("%s:%s", os.Getenv("HOST"), os.Getenv("PORT"))
	fmt.Printf("listening on %s...", bind)
	err := http.ListenAndServe(bind, nil)
	if err != nil {
		panic(err)
	}
}
