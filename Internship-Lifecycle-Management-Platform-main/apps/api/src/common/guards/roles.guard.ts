import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User authentication required for role verification');
    }

    const userRole = user.role?.toUpperCase();

    // Normalization mapping for role equivalence
    const isAllowed = requiredRoles.some((reqRole) => {
      const target = reqRole.toUpperCase();
      if (userRole === target) return true;
      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') return true; // Admins have broad oversight
      if ((target === 'COMPANY' || target === 'COMPANY_MENTOR') && (userRole === 'COMPANY' || userRole === 'COMPANY_MENTOR')) return true;
      if ((target === 'FACULTY' || target === 'FACULTY_MENTOR') && (userRole === 'FACULTY' || userRole === 'FACULTY_MENTOR')) return true;
      if ((target === 'TNP_ADMIN' || target === 'ADMIN') && (userRole === 'TNP_ADMIN' || userRole === 'ADMIN' || userRole === 'HOD_ADMIN')) return true;
      return false;
    });

    if (!isAllowed) {
      throw new ForbiddenException(`Insufficient permissions. Required roles: [${requiredRoles.join(', ')}]. Current role: ${user.role}`);
    }

    return true;
  }
}
