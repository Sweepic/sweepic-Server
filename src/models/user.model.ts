export interface UserModel {
  id: bigint;
  email: string;
  name: string;
  goalCount: number;
  createdAt: Date;
  updatedAt: Date;
  status: number;
}
