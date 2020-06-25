### -- Get All Users

GET /api/users <br>
List all the users(requires admin access)

### Headers

| Name          | Content        | Utility                       |
| ------------- | -------------- | ----------------------------- |
| authorization | bearer \*token | Knows that the user is logged |

\*token: authorization token and it is not optional

### Query

| Name    | Content          | Utility                                            |
| ------- | ---------------- | -------------------------------------------------- |
| page    | \*1              | Get the current page                               |
| limit   | \*10             | Limit the quantity of returned documents           |
| sort    | \*id,name        | Sort items by the provided fields                  |
| fields  | \*id, name, role | Returned fields                                    |
| deleted | \*true           | Returns only deleted users(if true) and vice versa |

\*: example and optional

### Returns

```json
[
  {
    "id": 1,
    "role": "admin",
    "deleted": false,
    "deletedByAdmin": false,
    "name": "Ulisses",
    "username": "test1",
    "email": "test1@test.com",
    "passwordRecuperation": null,
    "passwordExpiresIn": null
  },
  {
    "id": 2,
    "role": "user",
    "deleted": true,
    "deletedByAdmin": true,
    "name": "João",
    "username": "test2",
    "email": "test2@test.com",
    "passwordRecuperation": null,
    "passwordExpiresIn": null
  }
]
```

##### Possible Errors

403: Forbidden: Not allowed <br>
400: Bad Request: Token is valid, but the user isn't <br>
500: Internal Server Error <br>
411, 401: Token errors

##

## -- Get One user

GET /api/users/{id} <br>
Returns one specific user

### Params

| Name | Content | Utility                  |
| ---- | ------- | ------------------------ |
| id   | \*1     | Id used to find the user |

\*: example

### Returns

200

```json
{
  "id": 2,
  "role": "user",
  "deleted": true,
  "deletedByAdmin": true,
  "name": "João",
  "username": "test2",
  "email": "test2@test.com",
  "passwordRecuperation": null,
  "passwordExpiresIn": null
}
```

##### Possible errors

`400`: Bad Request: User not found <br>
`500`: Internal Server Error

##

## --Login

POST /api/users/login <br>
Returns access token, so the user can log in

### Body

| Name     | Content             | Utility               |
| -------- | ------------------- | --------------------- |
| email    | \*email@mail.e-mail | Email verification    |
| password | \*123456            | Password verification |

\*: example and optional <br>

### Returns

200

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTkyOTU2MDAwLCJleHAiOjE1OTI5NTk2MDB9.skWyDRNQh2yqEp-xM7tXUUFc_hdFkGF5NxBjEZWsWyw",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTkyOTU2MDAwfQ.w4hxc2kfdAyU_Qh1thYuY1hHi4h_ynzUrtLhQDYvSdQ"
}
```

##### Possible errors

500: Internal Server Error <br>
400: Bad Request: Wrong email or password

##

## --Register

POST /api/users/register <br>
Register an user

### Body

| Name     | Content             | Utility        |
| -------- | ------------------- | -------------- |
| name     | \*dude              | Name field     |
| username | \*dudemanjjj        | Username field |
| email    | \*email@mail.e-mail | Email field    |
| password | \*123456            | Password field |

\*: example and optional <br>

### Returns

201

```json
{
  "user": [
    {
      "id": 3,
      "role": "user",
      "deleted": false,
      "name": "yay2",
      "username": "ya2",
      "email": "yay2@yay.org.com",
      "password": "$2b$10$50QavwhRdII1Cr6brWrlXeAuWWEhcgJqTVnkehFGg320FcG32VIHy",
      "passwordRecuperation": null,
      "passwordExpiresIn": null
    }
  ],
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI4NzI1MzMsImV4cCI6MTU5Mjg3NjEzM30.tZRqisYKy1QXRx-4qsGFo_lj1KHbzDGuLtvXF2Acm0E",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1OTI4NzI1MzN9.MaN2LQkr2lSclUddqDj5W-cm8URz_cHS0wFWm660YNE"
}
```

##### Possible Errors

500: Internal server error

##

## -- Get me

GET /api/users/get-me <br>
Get current logged user

### Headers

| Name          | Content        | Utility                       |
| ------------- | -------------- | ----------------------------- |
| authorization | bearer \*token | Knows that the user is logged |

\*: example and not optional <br>

### Returns

```json
{
  "user": {
    "id": 1,
    "role": "admin",
    "deleted": false,
    "name": "test",
    "username": "test",
    "email": "test@test.com",
    "password": "$2a$10$Sk4VVHJD8CAVqxkhGUCDX.pPAfA0niLh1.M3KhXjeB5RF8A86nFjm",
    "passwordRecuperation": null,
    "passwordExpiresIn": null
  },
  "id": 1
}
```

##### Possible errors

500: Internal Server Error
400: Bad Request: User Not Found <br>
401: Unauthorized: Token error <br>
411: Length required: Token length error <br>

##

## --Forgot pass

GET /api/users/forgot-password <br>
Send email to user with authorization token so he can change his password

### Body

| Name  | Content                | Utility                                                    |
| ----- | ---------------------- | ---------------------------------------------------------- |
| email | \*email@mail.email.com | Email field to send token, so the user can change password |

\*: example and not optional <br>

### Returns

204 No Content

##### Possible errors

500: Internal Server Error <br>
400: Bad Request: Wrong email

##

## --Reset Pass

PUT /api/users/reset-pass <br>
Reset password with the provided token

### Query

| Name  | Content | Utility |
| ----- | ------- | ------- |
| token | \*token | Token   |

### Body

| Name           | Content | Utility              |
| -------------- | ------- | -------------------- |
| password       | \*1234  | New password         |
| passwordRepeat | \*1234  | New password confirm |

\*: example and not optional <br>
\*token: token received on email(GET api/users/forgot-password)

### Returns

200

```json
{
  "message": "Success"
}
```

##### Possible Errors

500: Internal Server Error <br>
400: Bad Request

##

## --Activate

PUT /api/users/activate-user/{id} <br>
Activate account of any user

### Headers

| Name          | Content        | Utility                       |
| ------------- | -------------- | ----------------------------- |
| authorization | bearer \*token | Knows that the user is logged |

### Params

| Name | Content | Utility              |
| ---- | ------- | -------------------- |
| id   | \*\*1   | Id used to find user |

\*\*: example and optional <br>
\*: example and obrigatory <br>
\*\*\*token: authorization token and it is not optional

### Returns

204 Error

##### Possible Errors

403: Forbidden: Not allowed <br>
400: Bad Request: User Not Found <br>
401: Unauthorized: Token error <br>
411: Length required: Token length error <br>
500: Internal Server Error

## --Activate me

PUT /api/users/activate-me <br>
Activate account of current logged user

### Headers

| Name          | Content        | Utility                       |
| ------------- | -------------- | ----------------------------- |
| authorization | bearer \*token | Knows that the user is logged |

\*\*: example and optional <br>
\*: example and obrigatory <br>
\*\*\*token: authorization token and it is not optional

### Returns

204 No Content

##### Possible Errors

403: Forbidden: Not allowed <br>
400: Bad Request: User Not Found <br>
401: Unauthorized: Token error <br>
411: Length required: Token length error <br>
500: Internal Server Error

## --Delete me

PUT /api/users/delete-me/ <br>
Delete account of current logged user

### Headers

| Name          | Content        | Utility                       |
| ------------- | -------------- | ----------------------------- |
| authorization | bearer \*token | Knows that the user is logged |

\*: example and obrigatory <br>

token: authorization token and it is not optional

### Returns

204 No Content

##### Possible Errors

403: Forbidden: Not allowed <br>
400: Bad Request: User Not Found <br>
401: Unauthorized: Token error <br>
411: Length required: Token length error <br>
500: Internal Server Error

##

## -- Delete

DELETE /api/users/{1} <br>
Delete user(not removing the collection from the database)

### Params

| Name | Content | Utility                  |
| ---- | ------- | ------------------------ |
| id   | \*\*1   | Id used to find the user |

### Headers

| Name          | Content        | Utility                       |
| ------------- | -------------- | ----------------------------- |
| authorization | bearer \*token | Knows that the user is logged |

\*\*: example and optional <br>
\*: example and obrigatory

##

## -- Update

PUT /api/users/{1} <br>
Update an user from the database, but requires admin access

### Body

| Name     | Content                 | Utility               |
| -------- | ----------------------- | --------------------- |
| role     | \*\*admin               | Role field            |
| name     | \*\*Ulisses             | Name field            |
| username | \*\*the-programmer-dude | Username field        |
| email    | \*\*email@mail.e-mail   | Email field           |
| password | \*\*123456              | Password verification |

### Headers

| Name          | Content          | Utility                       |
| ------------- | ---------------- | ----------------------------- |
| authorization | bearer \*\*token | Knows that the user is logged |

### Params

| Name | Content | Utility              |
| ---- | ------- | -------------------- |
| id   | \*\*1   | Id used to find user |

\*\*: example and optional <br>
\*: example and obrigatory <br>

### Returns

200

```json
{
  "userUpdated": {
    "id": 1,
    "role": "admin",
    "deleted": false,
    "deletedByAdmin": false,
    "name": "ulisses",
    "username": "test",
    "email": "test@test.com",
    "password": "$2a$10$Sk4VVHJD8CAVqxkhGUCDX.pPAfA0niLh1.M3KhXjeB5RF8A86nFjm",
    "passwordRecuperation": null,
    "passwordExpiresIn": null
  }
}
```

##### Possible errors

403: Forbidden: Not allowed <br>
400: Bad Request: User Not Found <br>
401: Unauthorized: Token error <br>
411: Length required: Token length error <br>
500: Internal Server Error

##

## -- Update me

PUT /api/users/ <br>
Update current logged user

### Body

| Name     | Content                 | Utility        |
| -------- | ----------------------- | -------------- |
| name     | \*\*Ulisses             | Name field     |
| username | \*\*the-programmer-dude | Username field |
| email    | \*\*email@mail.e-mail   | Email field    |

### Headers

| Name          | Content          | Utility                       |
| ------------- | ---------------- | ----------------------------- |
| authorization | bearer \*\*token | Knows that the user is logged |

\*\*: example and optional <br>
\*: example and obrigatory <br>

### Returns

200

```json
[
  {
    "id": 2,
    "role": "user",
    "deleted": true,
    "deletedByAdmin": true,
    "name": "João",
    "username": "test2",
    "email": "test2@test.com",
    "password": "$2b$10$jQoU7KTlZ0cvsSpaJlW1ge9vexD.udJ3yWqcr0ZuXA0PdiuAPcXtu",
    "passwordRecuperation": null,
    "passwordExpiresIn": null
  }
]
```

##### Possible errors

403: Forbidden: Not allowed <br>
400: Bad Request: User Not Found <br>
401: Unauthorized: Token error <br>
411: Length required: Token length error <br>
500: Internal Server Error
