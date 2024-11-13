Just runing the tests `npm test -- --verbose`

```
 PASS  src/auth/auth.service.spec.ts (7.417 s)
  AuthService
    √ should be defined (20 ms)
    validateUser
      √ should validate user successfully (6 ms)
      √ should throw BadRequestException if email does not exist (18 ms)
      √ should throw BadRequestException if password is invalid (3 ms)
    generateJwtToken
      √ should generate JWT token (4 ms)
    getHashedPassword
      √ should hash password successfully (2 ms)
      √ should handle hashing error (5 ms)

 PASS  src/message/message.service.spec.ts (7.426 s)
  MessageService
    √ should be defined (30 ms)
    sendMessage
      √ should successfully send a message (10 ms)
      √ should throw BadRequestException if receiver not found (17 ms)
    viewMessages
      √ should return messages between two users (6 ms)

 PASS  src/auth/jwtStrategy.spec.ts (7.547 s)
  JwtStrategy
    √ should be defined (34 ms)
    validate
      √ should return the user when validated (5 ms)
      √ should throw an UnauthorizedException if user is not found (18 ms)

 PASS  src/auth/auth.controller.spec.ts      
  AuthController
    √ should be defined (18 ms)
    login
      √ should return JWT token on successful login (7 ms)
    getUser
      √ should return user profile (4 ms)

 PASS  src/message/message.gateway.spec.ts   
  MessageGateway
    √ should be defined (28 ms)
    handleConnection
      √ should log when client connects (7 ms)
    handleDisconnect
      √ should remove user from userSockets map when disconnecting (3 ms)
    handleRegister
      √ should register user socket (6 ms)
    handleMessage
      √ should handle message sending and notify receivers (6 ms)
      √ should not emit to receiver if receiver is not connected (5 ms)

 PASS  src/Profile/profile.controller.spec.ts
  ProfileController
    create
      √ should create a profile successfully (19 ms)
    getProfile
      √ should get profile successfully (5 ms)
      √ should throw NotFoundException when profile not found (19 ms)
    updateProfile
      √ should update profile successfully (3 ms)
      √ should throw BadRequestException when update fails (5 ms)
      √ should pass through NotFoundException from service (3 ms)

 PASS  src/message/message.controller.spec.ts
  MessageController
    √ should be defined (16 ms)
    sendMessage
      √ should send a message successfully (5 ms)
    viewMessages
      √ should return messages between users (3 ms)

[Nest] 20040  - 11/13/2024, 14:25:34   ERROR [UserController] Something went wrong in signup:
[Nest] 20040  - 11/13/2024, 14:25:34   ERROR [UserController] ConflictException: User Already Exist
 PASS  src/user/user.controller.spec.ts
  UserController
    √ should be defined (28 ms)
    create
      √ should create a new user successfully (10 ms)
      √ should throw ConflictException if user already exists (24 ms)

 PASS  src/user/user.service.spec.ts      
  UserService
    √ should be defined (19 ms)
    create
      √ should create a user successfully (10 ms)
      √ should throw BadRequestException for invalid username length (21 ms)
      √ should throw BadRequestException for password mismatch (4 ms)
    findOne
      √ should find a user (3 ms)

 PASS  src/utils/emailValidation.spec.ts
  validateMail
    √ should return null for a valid email with existing domain (4 ms)
    √ should return "Invalid email" for an invalid email format
    √ should return "Domain email not found" for a non-existing domain (1 ms)
    √ should return "Domain email not found" for an email with no MX records (1 ms)

 PASS  src/app.controller.spec.ts
  AppController
    root
      √ should return "Hello World!" (38 ms)

 PASS  src/utils/passwordValidation.spec.ts
  validatePassword
    √ should return an error for passwords less than 8 (2 ms)
    √ should return an error for passwords without uppercase
    √ should return an error for passwords without lowercase (1 ms)
    √ should return an error for passwords without symbols
    √ should return an error for passwords without uppercase, lowercase, and symbols (1 ms)
    √ should return null for valid passwords

 PASS  src/utils/calculateZodiac.spec.ts
  calculateZodiac
    √ should return Aries for March 21 (3 ms)
    √ should return Taurus for April 20 (1 ms)
    √ should return Gemini for June 15 (1 ms)
    √ should return Cancer for July 22
    √ should return Leo for August 1 (1 ms)
    √ should return Virgo for September 1
    √ should return Libra for October 10
    √ should return Scorpio for November 1
    √ should return Sagittarius for December 15
    √ should return Capricorn for January 10 (1 ms)
    √ should return Aquarius for February 5 (1 ms)
    √ should return Pisces for March 10 (1 ms)

 PASS  src/Profile/profile.service.spec.ts
  ProfileService
    √ should throw ConflictException if user already has a profile (31 ms)
    √ should create a profile if user does not have one (5 ms)
    √ should return a profile if it exists (2 ms)
    √ should throw NotFoundException if profile does not exist (2 ms)
    getProfile
      √ should return profile if found (5 ms)
      √ should throw NotFoundException if profile not found (2 ms)
    updateProfile
      √ should update and return the updated profile if found (2 ms)
      √ should throw NotFoundException if profile to update is not found (2 ms)

Test Suites: 14 passed, 14 total
Tests:       71 passed, 71 total
Snapshots:   0 total
Time:        12.059 s, estimated 13 s
```