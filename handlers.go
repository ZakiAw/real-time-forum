package main

import (
	"fmt"
	"net/http"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	// fmt.Println("Incoming request method:", r.Method)
	if r.Method == http.MethodGet {
		err := tbl.ExecuteTemplate(w, "test.html", nil)
		if err != nil {
			fmt.Println("Error rendering template:", err)
			http.Error(w, "Error rendering template", http.StatusInternalServerError)
		}
		return
	}

	// if r.Method == http.MethodPost {
	// 	err := r.ParseForm()
	// 	if err != nil {
	// 		fmt.Println("Error parsing form:", err)
	// 		http.Error(w, "Invalid form submission", http.StatusBadRequest)
	// 		return
	// 	}

	nickname := r.FormValue("nickname")
	firstName := r.FormValue("first_name")
	lastName := r.FormValue("last_name")
	email := r.FormValue("email")
	password := r.FormValue("password")
	age := r.FormValue("age")
	gender := r.FormValue("gender")

	/* TESTING FORMVALUE
	fmt.Println("Form values received:")
	fmt.Printf("nickname: %s, firstName: %s, lastName: %s, email: %s, password: %s, age: %s, gender: %s\n",
		nickname, firstName, lastName, email, password, age, gender)
	*/
	if nickname == "" || firstName == "" || lastName == "" || email == "" || password == "" || age == "" || gender == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	_, err := db.Exec(`
		INSERT INTO users (nickname, first_name, last_name, email, password, age, gender)
		VALUES (?, ?, ?, ?, ?, ?, ?)`,
		nickname, firstName, lastName, email, password, age, gender,
	)
	if err != nil {
		fmt.Println("Error inserting data:", err)
		http.Error(w, "Failed to create account", http.StatusInternalServerError)
		return
	}
	fmt.Fprint(w, "Account created successfully!")
}
