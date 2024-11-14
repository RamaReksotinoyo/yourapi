import { Injectable, forwardRef, Inject, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import { AuthService } from '../auth/auth.service';
import { validatePassword } from '../utils/passwordValidation'
import { validateMail } from '../utils/emailValidation'

@Injectable()
export class UserService {
  logger: Logger;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private AuthService: AuthService
  ) {
    this.logger = new Logger(UserService.name);
  }

  async findOne(query: any): Promise<any> {
    return await this.userModel.findOne(query).select('+password');
  }

  async create(user: any): Promise<any> {
    this.logger.log('Creating user.');
   
    // Email validation
    const invalidEmail = await validateMail(user.email)
    if (invalidEmail != null) {
      throw new BadRequestException('Invalid email');
    } 

    // Username validation
    if (user.username.length < 5 || user.username.length > 25) {
      throw new BadRequestException('Username must be between 5 and 20 characters.');
    }

    // Password validation
    const invalidPassword = validatePassword(user.password)
    if (invalidPassword) {
      throw new BadRequestException('Passwords must consist of 8 characters, lowercase, uppercase, numbers, and symbols.');
    } 

    // password and confirmPassword validation (Must be same)
    if (user.password !== user.confirmPassword) {
        throw new BadRequestException('Password and confirm password do not match.');
    }

    const hashedPassword = await this.AuthService.getHashedPassword(
      user.password
    );
    user.password = hashedPassword;
    const newUser = await this.userModel.create(user);
    return newUser;
  }

  async findOneAndUpdate(query: any, payload: any): Promise<User> {
    this.logger.log('Updating User.');
    return this.userModel.findOneAndUpdate(query, payload, {
      new: true,
      upsert: true,
    });
  }
}