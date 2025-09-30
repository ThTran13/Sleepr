import { IsEmail, IsString } from "class-validator";

export class NotifyEmailDto {
    @IsEmail()
    email: String;

    @IsString()
    text: string;
}