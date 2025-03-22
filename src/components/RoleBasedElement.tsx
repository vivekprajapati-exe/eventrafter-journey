
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface RoleBasedElementProps {
  requiredRole: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RoleBasedElement({ 
  requiredRole, 
  children, 
  fallback = null 
}: RoleBasedElementProps) {
  const { hasPermission } = useAuth();
  
  if (hasPermission(requiredRole)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}
