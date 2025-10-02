import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RoleDto {
    @IsOptional()
    @IsNumber()
    is?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;
}