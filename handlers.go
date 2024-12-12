package main

import (
	"fmt"
	"net/http"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	tbl.ExecuteTemplate(w, "index.html", nil)
	// fmt.Println("Incoming request method:", r.Method)
	if r.Method == http.MethodGet {
		err := tbl.ExecuteTemplate(w, "index.html", nil)
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
	// w.Header().Set("Content-Type", "application/json")
    // w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "Account created successfully!")
}


// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method == http.MethodPost {
// 		nickname := r.FormValue("nickname")
// 		password := r.FormValue("password")

// 		var storedPassword string
// 		err := db.QueryRow(`SELECT password FROM users WHERE nickname = ?`, nickname).Scan(&storedPassword)
// 		if err != nil {
// 			http.Error(w, "Invalid nickname or password", http.StatusUnauthorized)
// 			return
// 		}

// 		if storedPassword != password {
// 			http.Error(w, "Invalid nickname or password", http.StatusUnauthorized)
// 			return
// 		}

// 		// Respond with success
// 		w.Header().Set("Content-Type", "application/json")
// 		w.WriteHeader(http.StatusOK)
// 		fmt.Fprint(w, `{"message": "Login successful!"}`)
// 	}
// }