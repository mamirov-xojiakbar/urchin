import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { log } from "console";

@Injectable()
export class IpGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();

    // Extract IP address from the request
    const currentIpAddress =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Extract JWT from Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw new UnauthorizedException("Authorization header is missing");
    }

    const token = authHeader.split(" ")[1];

    // Decode the JWT token to extract the payload (no need to verify here since AuthGuard does it)
    const decodedToken = this.jwtService.decode(token) as any;

    if (!decodedToken) {
      throw new UnauthorizedException("Invalid token");
    }

    const tokenIpAddress = decodedToken.IPadress;

    // Compare the IP addresses
    if (currentIpAddress !== tokenIpAddress) {
      throw new UnauthorizedException("IP address mismatch");
    }

    // Allow access if IP addresses match
    return true;
  }
}
