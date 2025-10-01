import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetuserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UsersRepository) { }

    async create(createUserDto: CreateUserDto) {
        await this.validateCreateUserDto(createUserDto);
        return this.userRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10),
            id,
        });
    }

    private async validateCreateUserDto(createUserDto: CreateUserDto) {
        try {
            await this.userRepository.findOne({ email: createUserDto.email });
        } catch (err) {
            return;
        }
        throw new UnprocessableEntityException('Email already exists.');
    }

    async verifyUser(email: string, password: string) {
        const user = await this.userRepository.findOne({ email });
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            throw new UnauthorizedException('Credentials are not valid. ');
        }
        return user;
    }

    async getUser(getUserDto: GetuserDto) {
        return this.userRepository.findOne(getUserDto);
    }
}
