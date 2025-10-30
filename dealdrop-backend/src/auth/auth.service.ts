import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.userModel.create({ ...data, password: hashed });
    const token = this.jwtService.sign({ id: user._id });
    return { token, user };
  }

  async login(data: any) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error('Invalid credentials');
    }
    const token = this.jwtService.sign({ id: user._id });
    return { token, user };
  }

  async getProfile(userId: string) {
    return this.userModel.findById(userId).select('-password');
  }
}