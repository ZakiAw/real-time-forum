package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
)

var (
	tbl *template.Template
	db  = makeSQL()
)

func main() {
	fmt.Println("running at http://localhost:8080")

	os.Mkdir("SQL", 0o755)
	SqlTables(db)

	fs := http.FileServer(http.Dir("style"))
	http.Handle("/style/", http.StripPrefix("/style/", fs))
	tbl, _ = template.ParseGlob("*.html")

	http.HandleFunc("/", RegisterHandler)
//	http.HandleFunc("/login", LoginHandler)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
