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

	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	
	
	// fs := http.FileServer(http.Dir("style"))
	// http.Handle("/style/", http.StripPrefix("/style/", fs))
	// tbl, _ = template.ParseGlob("*.html")

	http.HandleFunc("/", RegisterHandler)
	http.HandleFunc("/login", LoginHandler)
	http.HandleFunc("/home", PostHandler)
	http.HandleFunc("/check-login", CheckLoginHandler)
	tbl = template.Must(template.ParseFiles("./index.html"))
	http.ListenAndServe(":8080", nil)
	}

