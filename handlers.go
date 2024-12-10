package main

import (
//	"encoding/json"
	"fmt"
	"net/http"
)

type User struct {
	Nickname  string `json:"nickName"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Age       int    `json:"age"`
	Gender    string `json:"gender"`
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var user User
	if r.Method == http.MethodGet {
		err := tbl.ExecuteTemplate(w, "test.html", nil)
		if err != nil {
			fmt.Println("excute err", err)
		}
		return
	}
	_, err := db.Exec(`
	INSERT INTO users (nickname, first_name, last_name, email, password, age, gender)
	VALUES (?, ?, ?, ?, ?, ?, ?)`,
		user.Nickname, user.FirstName, user.LastName, user.Email, user.Password, user.Age, user.Gender,
	)
	if err != nil {
		fmt.Println("Error inserting data")
		return
	}
	//w.Header().Add("Content-Type", "application/json")
	//json.NewEncoder(w).Encode(user)
}
