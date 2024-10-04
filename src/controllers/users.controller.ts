import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() dto: { username: string; password: string }) {
    return this.usersService.create(dto.username, dto.password);
  }

  @Post('login')
  async login(@Body() dto: { username: string; password: string }) {
    const user = await this.usersService.validate(dto.username, dto.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.usersService.login(user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'user')
  @Get(':id/comments')
  async getUserComments(@Param('id') id: number) {
    return this.usersService.getUserComments(id);
  }

  @Post('change-language/:userId')
  async changeLanguage(
    @Param('userId') userId: number,
    @Body('language') language: string,
  ) {
    return this.usersService.changeLanguage(userId, language);
  }

  
}
