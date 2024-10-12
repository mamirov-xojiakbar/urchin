"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let IpGuard = class IpGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const currentIpAddress = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            throw new common_1.UnauthorizedException("Authorization header is missing");
        }
        const token = authHeader.split(" ")[1];
        const decodedToken = this.jwtService.decode(token);
        if (!decodedToken) {
            throw new common_1.UnauthorizedException("Invalid token");
        }
        const tokenIpAddress = decodedToken.IPadress;
        if (currentIpAddress !== tokenIpAddress) {
            throw new common_1.UnauthorizedException("IP address mismatch");
        }
        return true;
    }
};
exports.IpGuard = IpGuard;
exports.IpGuard = IpGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], IpGuard);
//# sourceMappingURL=ip.adress.guard.js.map