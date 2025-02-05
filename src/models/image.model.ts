export interface BodyToImage {
  mediaId: bigint;
  userId: bigint;
}

export interface ResponseFromImage extends BodyToImage {
  id: bigint;
  createdAt: Date;
  updatedAt: Date | null;
  status: number;
}
