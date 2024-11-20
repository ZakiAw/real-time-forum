package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

func SqlTables() {
	db, err := sql.Open("sqlite3", "./SQL/data.db")
	if err != nil {
		fmt.Println("opening db error", err)
		return
	}

	query := `
	CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	nickname TEXT NOT NULL UNIQUE,
	email TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL,
	age INTEGER NOT NULL,
	CHECK (age >= 13)
	gender TEXT NOT NULL
	first_name TEXT NOT NULL
	last_name TEXT NOT NULL
	);
	CREATE TABLE IF NOT EXISTS posts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL,
	username TEXT NOT NULL,
	content TEXT NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)
	`
	_, err = db.Exec(query)
	if err != nil {
		log.Fatal(err)
	}
}
