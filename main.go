package main

import (
	"fmt"
	"html/template"
	"net/http"
	"os"
)
var tbl *template.Template
func main() {
	fmt.Println("running at http://localhost:8080")
	os.Mkdir("SQL", 0o755)
	SqlTables()
	tbl, _ = template.ParseGlob("*.html")
	http.HandleFunc("/", RegisterHandler)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}
