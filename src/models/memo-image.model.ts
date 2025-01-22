export interface ResponseFromMemoImage {
  id: string;
  folderId: string;
  url: string;
  createdAt: Date;
  updatedAt: Date | null;
  status: number;
}

export interface BodyToMemoImage {
  url: string;
}
