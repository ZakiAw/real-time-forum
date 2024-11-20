package main

import (
	"fmt"
	"os"
)

func main(){
	fmt.Println("running at http://localhost:8080")
	os.Mkdir("SQL", 0o755)
	SqlTables()
}