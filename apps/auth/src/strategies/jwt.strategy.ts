import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "../users/users.service";
import { ExtractJwt, Strategy } from "passport-jwt";
import { tokenPayload } from "../interfaces/token-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        configService: ConfigService,
        private readonly usersService: UsersService,
    ) {
        const jwtSecret = configService.get('JWT_SECRET');
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: any) => 
                    request?.cookies?.Authentication || request?.Authentication,
            ]),
            secretOrKey: jwtSecret,
        });
    }

    async validate({ userId }: tokenPayload) {
        return this.usersService.getUser({ id: userId })
    }
}