package main

import (
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
	if r.Method != http.MethodPost {
		fmt.Println("Error registerhandler method")
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
}