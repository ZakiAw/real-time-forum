package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
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

	nickname := r.FormValue("nickname")
	firstName := r.FormValue("first_name")
	lastName := r.FormValue("last_name")
	email := r.FormValue("email")
	password := r.FormValue("password")
	age := r.FormValue("age")
	gender := r.FormValue("gender")

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
	setSession(w, nickname)
	fmt.Fprint(w, "Account created successfully!")
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		err := tbl.ExecuteTemplate(w, "index.html", nil)
		if err != nil {
			fmt.Println("Error rendering template:", err)
			http.Error(w, "Error rendering template", http.StatusInternalServerError)
		}
		return
	}

	if r.Method == http.MethodPost {
		nickname := r.FormValue("nickname")
		password := r.FormValue("password")

		var storedPassword string
		err := db.QueryRow(`SELECT password FROM users WHERE nickname = ?`, nickname).Scan(&storedPassword)
		if err != nil {
			fmt.Println("Error querying database:", err)
			http.Error(w, "Invalid nickname or password", http.StatusUnauthorized)
			return
		}

		if storedPassword != password {
			http.Error(w, "Invalid nickname or password", http.StatusUnauthorized)
			return
		}

		setSession(w, nickname)

		// Send a JSON response on successful login
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		fmt.Fprint(w, `{"message": "Login successful!"}`)
	}
}

func PostHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		// Retrieve posts
		rows, err := db.Query(`
            SELECT title, content, username, created_at
            FROM posts
            ORDER BY created_at DESC
        `)
		if err != nil {
			log.Printf("Error querying posts: %v", err)
			http.Error(w, "Failed to retrieve posts", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		type Post struct {
			Title     string `json:"title"`
			Content   string `json:"content"`
			Username  string `json:"username"`
			CreatedAt string `json:"created_at"`
		}

		var posts []Post
		for rows.Next() {
			var post Post
			if err := rows.Scan(&post.Title, &post.Content, &post.Username, &post.CreatedAt); err != nil {
				log.Printf("Error scanning post: %v", err)
				http.Error(w, "Failed to scan post", http.StatusInternalServerError)
				return
			}
			posts = append(posts, post)
		}

		// Retrieve members
		memberRows, err := db.Query(`SELECT nickname FROM users`)
		if err != nil {
			log.Printf("Error querying users: %v", err)
			http.Error(w, "Failed to retrieve users", http.StatusInternalServerError)
			return
		}
		defer memberRows.Close()

		type User struct {
			Nickname string `json:"nickname"`
		}

		var users []User
		for memberRows.Next() {
			var user User
			if err := memberRows.Scan(&user.Nickname); err != nil {
				log.Printf("Error scanning member: %v", err)
				http.Error(w, "Failed to scan member", http.StatusInternalServerError)
				return
			}
			users = append(users, user)
		}

		// Send posts and members
		response := map[string]interface{}{
			"posts":   posts,
			"members": users,
		}
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(response); err != nil {
			log.Printf("Error encoding response: %v", err)
			http.Error(w, "Failed to encode response as JSON", http.StatusInternalServerError)
		}
		return
	}

	if r.Method == http.MethodPost {
		// Decode input
		var postData struct {
			Title   string `json:"title"`
			Content string `json:"content"`
		}
		if err := json.NewDecoder(r.Body).Decode(&postData); err != nil {
			log.Printf("Error decoding input: %v", err)
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		// Verify session
		nickname, loggedIn := getSession(r)
		if !loggedIn {
			http.Redirect(w, r, "/login", http.StatusSeeOther)
			return
		}

		// Insert post
		_, err := db.Exec(`
            INSERT INTO posts (title, content, username)
            VALUES (?, ?, ?)`,
			postData.Title, postData.Content, nickname,
		)
		if err != nil {
			log.Printf("Error inserting post: %v", err)
			http.Error(w, "Failed to create post", http.StatusInternalServerError)
			return
		}

		// Success response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Post created successfully!"})
	}
}

func CheckLoginHandler(w http.ResponseWriter, r *http.Request) {
	nickname, loggedIn := getSession(r)
	if !loggedIn {
		w.WriteHeader(http.StatusUnauthorized) // Return 401 Unauthorized
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"nickname": nickname})
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	cookie := &http.Cookie{
		Name:     "sID",
		Value:    "",
		Path:     "/",
		Expires:  time.Unix(0, 0),
		Secure:   true,
		HttpOnly: true,
	}
	http.SetCookie(w, cookie)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Logged out successfully!"})
}
