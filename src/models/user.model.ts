export interface UserModel {
  id: bigint;
  email: string;
  name: string;
  goalCount: number;
  createdAt: Date;
  updatedAt: Date | null;
  status: number;
}

export interface ResponseUser {
  id: string;
  email: string;
  name: string;
  goalCount: number;
  createdAt: Date;
  updatedAt: Date | null;
  status: number;
}
