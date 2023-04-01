package main

import (
	"github.com/mdsohelmia/cdnmonitoring/database"
	"github.com/mdsohelmia/cdnmonitoring/models"
)

func main() {
	db, err := database.NewDatabase()
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&models.Report{})
}
