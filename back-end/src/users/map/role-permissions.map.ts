// role-permissions.map.ts
import { UserRole } from '../roles.enum';
import { UserPermissions } from '../permissions.enum';

export const ROLE_PERMISSIONS_MAP: Record<UserRole, UserPermissions[]> = {
  [UserRole.Seller]: [UserPermissions.MakeSales],

  [UserRole.Manager]: [
    UserPermissions.MakeSales,
    UserPermissions.EditMaterials,
    UserPermissions.EditProducts,
    UserPermissions.ViewReports,
  ],

  [UserRole.Owner]: [
    UserPermissions.MakeSales,
    UserPermissions.EditMaterials,
    UserPermissions.EditProducts,
    UserPermissions.ViewReports,
    UserPermissions.EditUsers,
  ],
};
