# food-ordering-app-backend
A REST API built using json-server to act as a backend for a food ordering app with JWT authentication and role based authorization

You can run this application using the following command
```
node server
```

You can build a test frontend application for ordering food using this REST API. 


## Authorization
Following roles are supported 

There is no protection for the signup route and the login route

| Role          | Access          | 
| ------------- |:-------------:|
| consumer    | login view menu, view/add/delete to cart, view orders | 
| restaurant    | login, view/add/update/delete food items, view/update/delete orders      | 
| admin | view/add/update/delete restaurants      |
