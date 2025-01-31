// https://github.com/carlosm27/apiwithgorm
// A REST API in Go using Gin framework and GORM as ORM.
package main

import (
	"log"

	"github.com/carlosm27/apiwithgorm/grocery"
	"github.com/carlosm27/apiwithgorm/model"
	"github.com/gin-gonic/gin"
)

func main() {
	model.Database()

	router := gin.Default()

	router.GET("/groceries", grocery.GetGroceries)
	router.GET("/grocery/:id", grocery.GetGrocery)
	router.POST("/grocery", grocery.PostGrocery)
	router.PUT("/grocery/:id", grocery.UpdateGrocery)
	router.DELETE("/grocery/:id", grocery.DeleteGrocery)

	log.Fatal(router.Run(":10000"))
}

// model/database.go
package model

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Database() *gorm.DB {
	_db, err := gorm.Open(sqlite.Open("./database.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	if err := _db.AutoMigrate(&Grocery{}); err != nil {
		panic(err)
	}

	Db := _db
	return Db
}

// model/databaseDriver.go
package model

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Database() *gorm.DB {
	_db, err := gorm.Open(sqlite.Open("./database.db"), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	if err := _db.AutoMigrate(&Grocery{}); err != nil {
		panic(err)
	}

	Db := _db
	return Db
}

// model/groceryModel.go
package model

import (
	//"time"

	"gorm.io/gorm"
)

type Grocery struct {
	gorm.Model
	Name     string `json:"name"`
	Quantity int    `json:"quantity"`
}

// grocery/groceryService.go
package grocery

import (
	"net/http"

	"github.com/carlosm27/apiwithgorm/model"
	"github.com/gin-gonic/gin"
)

type NewGrocery struct {
	Name     string `json:"name" binding:"required"`
	Quantity int    `json:"quantity" binding:"required"`
}

type GroceryUpdate struct {
	Name     string `json:"name"`
	Quantity int    `json:"quantity"`
}

func GetGroceries(c *gin.Context) {
	var groceries []model.Grocery

	model.Database().Find(&groceries)
	c.JSON(http.StatusOK, groceries)
}

func GetGrocery(c *gin.Context) {
	var grocery model.Grocery

	if err := model.Database().Where("id= ?", c.Param("id")).First(&grocery).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Grocery not found"})
		return
	}

	c.JSON(http.StatusOK, grocery)
}

func PostGrocery(c *gin.Context) {
	var grocery NewGrocery

	if err := c.ShouldBindJSON(&grocery); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newGrocery := model.Grocery{Name: grocery.Name, Quantity: grocery.Quantity}
	model.Database().Create(&newGrocery)

	c.JSON(http.StatusOK, newGrocery)
}

func UpdateGrocery(c *gin.Context) {
	var grocery model.Grocery

	if err := model.Database().Where("id = ?", c.Param("id")).First(&grocery).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Grocery not found!"})
		return
	}

	var updateGrocery GroceryUpdate

	if err := c.ShouldBindJSON(&updateGrocery); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	model.Database().Model(&grocery).
	  Updates(model.Grocery{
		  Name: updateGrocery.Name, 
		  Quantity: updateGrocery.Quantity
	  })

	c.JSON(http.StatusOK, grocery)
}

func DeleteGrocery(c *gin.Context) {
	var grocery model.Grocery

	if err := model.Database().Where("id = ?", c.Param("id")).First(&grocery).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Grocery not found!"})
		return
	}

	model.Database().Delete(&grocery)
	c.JSON(http.StatusOK, gin.H{"message": "Grocery deleted"})
}
