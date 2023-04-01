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


[Unit]
Description=cdn_monitoring
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/monitoring
ExecStart=/root/monitoring/main
Restart=always

[Install]
WantedBy=multi-user.target
