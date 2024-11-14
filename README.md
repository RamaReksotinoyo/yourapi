# Api Chat Using NESTJS & MongoDB.

How to run with docker:
1. Run the command docker-compose up -build -d
2. Run docker exec -it yourapi-app-1
3. Run npm uninstall bcrypt
4. npm install bcrypt
5. Exit the docker shell, then run curl localhost:3000/, if the server returns 'hello world', then the application has been successfully installed.

Or

Withour docker:
1. npm install 
2. specify your .env file with your mongodb connection.

Just runing the tests `npm test -- --verbose`

```
 PASS  src/app.controller.spec.ts
  AppController
    root
      ✓ should return "Hello World!" (11 ms)

 PASS  src/message/message.service.spec.ts
  MessageService
    ✓ should be defined (11 ms)
    sendMessage
      ✓ should successfully send a message (2 ms)
      ✓ should throw BadRequestException if receiver not found (13 ms)
    viewMessages
      ✓ should return messages between two users (2 ms)

 PASS  src/auth/auth.service.spec.ts (5.135 s)
  AuthService
    ✓ should be defined (12 ms)
    validateUser
      ✓ should validate user successfully (3 ms)
      ✓ should throw BadRequestException if email does not exist (13 ms)
      ✓ should throw BadRequestException if password is invalid (1 ms)
    generateJwtToken
      ✓ should generate JWT token (2 ms)
    getHashedPassword
      ✓ should hash password successfully (2 ms)
      ✓ should handle hashing error (4 ms)

 PASS  src/message/message.controller.spec.ts (5.333 s)
  MessageController
    ✓ should be defined (13 ms)
    sendMessage
      ✓ should send a message successfully (3 ms)
    viewMessages
      ✓ should return messages between users (4 ms)

 PASS  src/auth/auth.controller.spec.ts (5.384 s)
  AuthController
    ✓ should be defined (12 ms)
    login
      ✓ should return JWT token on successful login (4 ms)

 PASS  src/auth/jwtStrategy.spec.ts
  JwtStrategy
    ✓ should be defined (15 ms)
    validate
      ✓ should return the user when validated (9 ms)
      ✓ should throw an UnauthorizedException if user is not found (38 ms)

 PASS  src/utils/emailValidation.spec.ts
  validateMail
    ✓ should return null for a valid email with existing domain (2 ms)
    ✓ should return "Invalid email" for an invalid email format
    ✓ should return "Domain email not found" for a non-existing domain
    ✓ should return "Domain email not found" for an email with no MX records (1 ms)

 PASS  src/utils/passwordValidation.spec.ts
  validatePassword
    ✓ should return an error for passwords less than 8 (2 ms)
    ✓ should return an error for passwords without uppercase
    ✓ should return an error for passwords without lowercase
    ✓ should return an error for passwords without symbols
    ✓ should return an error for passwords without uppercase, lowercase, and symbols
    ✓ should return null for valid passwords

 PASS  src/utils/calculateZodiac.spec.ts
  calculateZodiac
    ✓ should return Aries for March 21 (1 ms)
    ✓ should return Taurus for April 20
    ✓ should return Gemini for June 15
    ✓ should return Cancer for July 22
    ✓ should return Leo for August 1
    ✓ should return Virgo for September 1
    ✓ should return Libra for October 10
    ✓ should return Scorpio for November 1
    ✓ should return Sagittarius for December 15
    ✓ should return Capricorn for January 10 (1 ms)
    ✓ should return Aquarius for February 5
    ✓ should return Pisces for March 10

 PASS  src/user/user.service.spec.ts (5.795 s)
  UserService
    ✓ should be defined (28 ms)
    create
      ✓ should create a user successfully (673 ms)
      ✓ should throw BadRequestException for invalid username length (26 ms)
      ✓ should throw BadRequestException for password mismatch (10 ms)
    findOne
      ✓ should find a user (6 ms)

[Nest] 88344  - 11/14/2024, 7:14:22 PM   ERROR [UserController] Something went wrong in signup:
[Nest] 88344  - 11/14/2024, 7:14:22 PM   ERROR [UserController] ConflictException: User Already Exist
 PASS  src/user/user.controller.spec.ts
  UserController
    ✓ should be defined (24 ms)
    create
      ✓ should create a new user successfully (2 ms)
      ✓ should throw ConflictException if user already exists (7 ms)

 PASS  src/Profile/profile.controller.spec.ts (5.881 s)
  ProfileController
    create
      ✓ should create a profile successfully (11 ms)
    getProfile
      ✓ should get profile successfully (2 ms)
      ✓ should throw NotFoundException when profile not found (9 ms)
    updateProfile
      ✓ should update profile successfully (2 ms)
      ✓ should throw BadRequestException when update fails (3 ms)
      ✓ should pass through NotFoundException from service (1 ms)

 PASS  src/message/message.gateway.spec.ts
  MessageGateway
    ✓ should be defined (6 ms)
    handleConnection
      ✓ should log when client connects (4 ms)
    handleDisconnect
      ✓ should remove user from userSockets map when disconnecting (2 ms)
    handleRegister
      ✓ should register user socket (1 ms)
    handleMessage
      ✓ should handle message sending and notify receivers (1 ms)
      ✓ should not emit to receiver if receiver is not connected (6 ms)

 PASS  src/Profile/profile.service.spec.ts
  ProfileService
    ✓ should throw ConflictException if user already has a profile (11 ms)
    ✓ should create a profile if user does not have one (2 ms)
    ✓ should return a profile if it exists (5 ms)
    ✓ should throw NotFoundException if profile does not exist (1 ms)
    getProfile
      ✓ should return profile if found (1 ms)
      ✓ should throw NotFoundException if profile not found (1 ms)
    updateProfile
      ✓ should update and return the updated profile if found (1 ms)
      ✓ should throw NotFoundException if profile to update is not found (1 ms)

Test Suites: 14 passed, 14 total
Tests:       70 passed, 70 total
Snapshots:   0 total
Time:        6.844 s
```

### The documentation has written in Swagger docs, check the docs by accesing :3000/docs. 