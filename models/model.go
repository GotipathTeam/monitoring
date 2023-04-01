package models

import (
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Report struct {
	gorm.Model
	ReportName string `json:"report_name"`
	ReportType string `json:"report_type"`
	SessionId  string `json:"session_id"`

	Payload datatypes.JSON `json:"payload"`
}
