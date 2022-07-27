# food-ordering-app-backend
A REST API built using json-server to act as a backend for a food ordering app with JWT authentication and role based authorization

You can run this application using the following command in the root folder
```
node server
```

You can build a test frontend application for ordering food using this REST API. 


## Authorization
Following roles are supported 

There is no protection for the signup route and the login route

| Role          | Access          | 
| ------------- |-------------|
| consumer    | login view menu, view/add/delete to cart, view orders | 
| restaurant    | login, view/add/update/delete food items, view/update/delete orders      | 
| admin | view/add/update/delete restaurants      |


## Routes

### A `Consumer` can access the following routes

| Method | Route          | Purpose          | 
| ------------- |-------------|-------------|
| POST | /signup | Register a new user |
| POST | /login  | Login with credentials | 
| GET | /foodItems?_expand=restaurant | Get all food items offered by all restaurants | 
| GET | /restaurants/:id | Get a single restaurant by id |
| POST | /cart | Add cart item to a consumer's cart | 
| PUT | /cart/:cartId | Update a cart item (quanity) |
| DELETE | /cart/:cartId | Delete an item from cart | 
| GET | /cart?userId=2&_expand=foodItem | Get cart items of a consumer | 
| POST | /orders | Create a new order | 
| GET | /orders?userId=:userId&_expand=restaurant | View orders of a consumer |
| GET | /orders/:orderId?_expand=restaurant | View a single order by id | 

### A `Restaurant` can access the following routes

| Method | Route          | Purpose          | 
| ------------- |-------------|-------------|
| POST | /signup | Register a new user |
| POST | /login  | Login with credentials | 
| GET | /foodItems?restaurantId=:restaurantId | Get all food items offered by all restaurants | 
| POST | /foodItems/:foodItemId | Add a new food item to menu | 
| PUT | /foodItems/:foodItemId | Update a food item (price) |
| DELETE | /foodItems/:foodItemId| Delete a food item | 
| GET | /restaurants/:restaurantId | Get a single restaurant by id |
| GET | /orders?restaurantId=:restaurantId | View all orders given to a restaurant |
| GET | /orders/:orderId | View a single order by id | 
| PUT | /orders/:orderId | Update a single order (status) | 


