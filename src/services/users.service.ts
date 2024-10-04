import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Comment } from '../models/comment.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Comment) private commentModel: typeof Comment,
    private jwtService: JwtService,
  ) {}

  async create(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userModel.create({
      username,
      password: hashedPassword,
      role: 'admin',
    });
  }

  async validate(username: string, password: string) {
    const user = await this.userModel.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  login(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    console.log(payload);
    return { access_token: this.jwtService.sign(payload) };
  }

  async getUserComments(userId: number) {
    return this.commentModel.findAll({
      where: { userId },
    });
  }

  async changeLanguage(userId: number, language: string) {
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.language = language;
    await user.save();
    return user;
  }
}
