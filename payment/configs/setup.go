package configs

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB() *mongo.Client {
	clientOptions := options.Client().ApplyURI(EnvMongoURI())

	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Ping(ctx, nil)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB")
	return client
}

// commenting this for now

// var DB *mongo.Client = ConnectDB()

// func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
// 	collection := client.Database("payment").Collection(collectionName)
// 	return collection
// }
