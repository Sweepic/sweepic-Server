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
