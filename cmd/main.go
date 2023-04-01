package main

import (
	"encoding/json"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/mdsohelmia/cdnmonitoring/database"
	"github.com/mdsohelmia/cdnmonitoring/models"
	"gorm.io/datatypes"
)

func main() {
	router := gin.New()
	router.Use(static.Serve("/", static.LocalFile("./ui/dist", true)))
	router.Use(
		gin.Logger(),
		gin.Recovery(),
		cors.New(cors.Config{
			AllowCredentials: false,
			AllowAllOrigins:  true,
			AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
			AllowHeaders:     []string{"Content-Type", "VideoId", "uppy-auth-token", "Content-Length", "Uppy-Versions", "Authorization", "X-Requested-With", "X-Request-ID", "X-HTTP-Method-Override", "Upload-Length", "Upload-Offset", "Tus-Resumable", "Upload-Metadata", "Upload-Defer-Length", "Upload-Concat", "User-Agent", "Accept", "Referrer", "Origin", "X-Auth-ClientId", "X-Auth-ApiKey", "X-Auth-LibraryId"},
			ExposeHeaders:    []string{"Access-Control-Allow-Headers", "Upload-Offset", "Location", "Upload-Length", "Tus-Version", "Tus-Resumable", "Tus-Max-Size", "Tus-Extension", "Upload-Metadata", "Upload-Defer-Length", "Upload-Concat", "Location", "Upload-Offset", "Upload-Length"},
		}),
	)
	router.GET("/cdn/reports", getReports)
	router.POST("/cdn/insights", createReport)
	router.Run(":8089") // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}

func getReports(c *gin.Context) {
	db, err := database.NewDatabase()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "database error",
		})
	}
	var reports []models.Report
	db.Model(&models.Report{}).Order("created_at DESC").Find(&reports)
	c.JSON(http.StatusOK, reports)
}

func createReport(c *gin.Context) {
	var report ReportRequest

	if err := c.BindJSON(&report); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid request",
		})
		return
	}
	db, err := database.NewDatabase()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "database connection error",
		})
		return
	}

	payload, err := json.Marshal(report.ReportData)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "internal server error",
		})
		return
	}

	reportData := models.Report{
		ReportName: report.ReportName,
		ReportType: report.ReportType,
		SessionId:  report.SessionId,
		Payload:    datatypes.JSON(payload),
	}

	if err := db.Model(&models.Report{}).Create(&reportData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "internal server error",
		})
		return
	}

	c.JSON(http.StatusOK, report)
}

type ReportRequest struct {
	SessionId  string     `json:"session_id"`
	ReportName string     `json:"report_name"`
	ReportType string     `json:"report_type"`
	ReportData ReportData `json:"payload"`
}

type ReportData struct {
	ClientInfo   interface{} `json:"client_info"`
	PlayerData   interface{} `json:"player_data"`
	ImageData    interface{} `json:"image_data"`
	Mp4VideoData interface{} `json:"mp4_data"`
	HlsVideoData interface{} `json:"hls_data"`
	Networking   interface{} `json:"networking"`
}
