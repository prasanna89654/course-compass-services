# Course Compass Services

This project consists of multiple microservices that can be easily run using Docker Compose.

- The academics service is build using [**.NET Core 7**](https://dotnet.microsoft.com/en-us/download/dotnet/7.0).
- The auth service is build using [**Nest Js**](https://nestjs.com/).
- The communication service is build using [**FastAPI**](https://fastapi.tiangolo.com/).
- The payment service is build using [**Golang(Gin)**](https://github.com/gin-gonic/gin).

## Prerequisites

Before you begin, ensure you have the following dependencies installed on your machine:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/lbtech-co/course-compass-services.git

2. Run the command to build images and run the containers. (Make sure to add a .env file in the root level of the project)
    ```bash
    docker compose up

3. You'll find the port to the specific services in their respective Dockerfile