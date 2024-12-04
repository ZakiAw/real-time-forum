package main

import (
	"fmt"
	"net/http"
	"os"
)

func main() {
	fmt.Println("running at http://localhost:8080")
	os.Mkdir("SQL", 0o755)
	SqlTables()
	http.HandleFunc("/", RegisterHandler)
	err := http.ListenAndServe(":8080", nil)
    if err != nil {
        fmt.Println("Error starting server:", err)
    }
}
