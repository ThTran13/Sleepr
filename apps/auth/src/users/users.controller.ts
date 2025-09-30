import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserDocument } from './models/user.schema';
import { CurrentUser } from '../../../../libs/common/src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guards';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getuser(@CurrentUser() user: UserDocument){
        return user;
    }
}

