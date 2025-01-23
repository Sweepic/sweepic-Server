export interface BodyToTag {
  content: string;
  tag_category_id: bigint;
}

export interface TagRequsetDto extends BodyToTag {}

export interface ResponseFromTag {
  id: bigint;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  status: number;
  tagCategoryId: bigint;
}

export interface TagResponseDto extends ResponseFromTag {}
