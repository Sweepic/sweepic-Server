export interface ResponseTagListWithDate {
  tags: string[];
}

export interface ResponseTagListFromImage {
  tags: {
    content: string;
    tagCategory: {
      id: string;
      tagType: string;
    };
  }[];
}

export interface ResponseCreationTags {
  tags: {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
    imageId: string;
    tagId: string;
  }[];
}

export const responseCreationTags = (
  imageTagData: {
    id: bigint;
    createdAt: Date;
    updatedAt: Date | null;
    status: number;
    imageId: bigint;
    tagId: bigint;
  }[],
): ResponseCreationTags => {
  const responseData = imageTagData.map(data => {
    const {id, createdAt, updatedAt, status, imageId, tagId} = data;
    return {
      id: id.toString(),
      createdAt,
      updatedAt,
      status,
      imageId: imageId.toString(),
      tagId: tagId.toString(),
    };
  });
  return {tags: responseData};
};
