# Feline Project Backend

This project provides a backend REST API using NestJS for generating personalised communications for customers. The key endpoint calculates and formats information about a customer's next delivery based on the provided user ID and associated cat data.

## Prerequisites

- **Node.js** version 18 or later.
- **Yarn** (or npm) to install and manage dependencies.
- **Postman** (optional): to easily test the API using the provided Postman collection.

## How to Run the API

1. **Clone the repository and change into the project directory**:

   ```bash
   git clone https://github.com/aaronowusu/feline-project-be.git

   cd feline-project-be
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Start the server**:
   ```bash
   yarn start
   ```
   The server will be running at http://localhost:3000.

## API Endpoints

`  /comms/your-next-delivery/:userId`

  - **Method**: GET

  - **Description**: This endpoint returns personalised delivery information for a user based on their cats' active subscriptions.

  - **Request Parameters**:
    - `userId` (string): A valid UUID representing the user.
  - **Response**:

    - `200 OK`: If a user with the given userId is found.
    - `404 Not Found`: If the userId does not exist in the data.json.
    - `400 Bad Request`: If the userId is not a valid UUID.

  - **Example Request**:

    ```bash
     curl --location 'http://localhost:3000/comms/your-next-delivery/53a7c4d2-e933-49d8-baac-c1d331b1cfbe'
    ```

  - **Example Response**
    ```json
    {
      "title": "Your next delivery for Dorian and Ocie",
      "message": "Hey Kayleigh! In two days' time, we'll be charging you for your next order for Dorian and Ocie's fresh food.",
      "totalPrice": 134.00,
      "freeGift": true
    }


## Postman Collection

A Postman collection is provided in the project root directory to easily test the API. You can import the collection into Postman and run the requests to test the API.

## Running Tests
Unit tests have been written for the services, repositories, and pipes in the application. To run the tests, use the following command:

```bash
yarn test
```


## Project Structure

### **src**
This directory contains the main codebase for the backend API.

#### **delivery**
The `delivery` module handles all delivery-related logic, including the service, controller, and repository.

- **pipes/**
  - `ValidateUUIDPipe`: Custom pipe for validating incoming UUID parameters.
  
- **delivery.module.ts**: Encapsulates the delivery service, controller, and repository.
  
- **delivery.controller.ts**: Handles incoming requests and returns responses.
  
- **delivery.service.ts**: Contains the business logic for calculating delivery details (e.g., pricing, formatting).
  
- **delivery.repository.ts**: Manages data access and interactions with the `data.json` file.
  
- **Tests**
  - **delivery.controller.spec.ts**: Unit tests for the delivery controller.
  - **delivery.service.spec.ts**: Unit tests for the delivery service.
  - **delivery.repository.spec.ts**: Unit tests for the delivery repository.

#### **main.ts**
The entry file for bootstrapping the NestJS application.

#### **constants.ts**
Contains static values (e.g., pouch sizes and prices) used throughout the application.

#### **types.ts**
Defines custom TypeScript types for the application, such as `User` and `Cat`.

#### **utils.ts**
Contains utility functions such as `formatCatNames`, used to format cat names into grammatically correct strings.

#### **data.json**
A JSON file containing sample user and cat data used by the application.


## Improvements

1. **Switch to a Proper Database**:
   Using a static `data.json` file is not scalable or reliable for production. Switching to a database (e.g., PostgreSQL, MongoDB) will allow for better data management, performance and security.

2. **Comprehensive Error Handling and Logging**:
   Implementing a global error handler in NestJS can catch unexpected errors and return user-friendly messages. 
   
   Adding structured logging (using tools like **Winston** or **Pino**) enables real-time monitoring and easy debugging, making it easier to trace issues in production.

3. **Implement Caching**:
   By introducing caching (e.g., Redis), you can store frequently requested data, such as delivery information, which eliminates the need to recalculate total prices on every request. This reduces server load, speeds up response times, and lowers operational costs, especially for users making frequent API calls with the same data.
