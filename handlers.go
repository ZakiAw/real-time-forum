package main

import (
	//	"encoding/json"
	"fmt"
	"net/http"
)

// type User struct {
// 	Nickname  string `json:"nickName"`
// 	FirstName string `json:"firstName"`
// 	LastName  string `json:"lastName"`
// 	Email     string `json:"email"`
// 	Password  string `json:"password"`
// 	Age       int    `json:"age"`
// 	Gender    string `json:"gender"`
// }

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Incoming request method:", r.Method)

	if r.Method == http.MethodGet {
		fmt.Println("Serving the registration page")
		err := tbl.ExecuteTemplate(w, "test.html", nil)
		if err != nil {
			fmt.Println("Error rendering template:", err)
			http.Error(w, "Error rendering template", http.StatusInternalServerError)
		}
		return
	}

	if r.Method == http.MethodPost {
		// Parse form data
		err := r.ParseForm()
		if err != nil {
			fmt.Println("Error parsing form:", err)
			http.Error(w, "Invalid form submission", http.StatusBadRequest)
			return
		}

		// Retrieve form values
		nickname := r.FormValue("nickname")
		firstName := r.FormValue("first_name")
		lastName := r.FormValue("last_name")
		email := r.FormValue("email")
		password := r.FormValue("password")
		age := r.FormValue("age")
		gender := r.FormValue("gender")

		// Log retrieved values
		fmt.Println("Form values received:")
		fmt.Printf("nickname: %s, firstName: %s, lastName: %s, email: %s, password: %s, age: %s, gender: %s\n",
			nickname, firstName, lastName, email, password, age, gender)

		// Validate fields
		if nickname == "" || firstName == "" || lastName == "" || email == "" || password == "" || age == "" || gender == "" {
			http.Error(w, "All fields are required", http.StatusBadRequest)
			return
		}
		if db == nil {
			http.Error(w, "Database not initialized", http.StatusInternalServerError)
			return
		}
		// Insert data into database
		_, err = db.Exec(`
		INSERT INTO users (nickname, first_name, last_name, email, password, age, gender)
		VALUES (?, ?, ?, ?, ?, ?, ?)`,
			nickname, firstName, lastName, email, password, age, gender,
		)
		if err != nil {
			fmt.Println("Error inserting data:", err)
			http.Error(w, "Failed to create account", http.StatusInternalServerError)
			return
		}

		// Respond with success
		fmt.Fprint(w, "Account created successfully!")
		return
	}

	// If method is not supported
	http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
}

