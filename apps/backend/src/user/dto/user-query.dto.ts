export class UserQueryDto {
  page?: number = 1;
  limit?: number = 10;
  search?: string;
  role?: string;
  isActive?: boolean;
}
