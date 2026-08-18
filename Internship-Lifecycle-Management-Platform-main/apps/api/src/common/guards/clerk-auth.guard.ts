import { AuthGuard } from './auth.guard';

// Re-export AuthGuard as ClerkAuthGuard for backward compatibility across modules
export { AuthGuard as ClerkAuthGuard, Public, IS_PUBLIC_KEY } from './auth.guard';
