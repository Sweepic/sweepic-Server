export interface ResponseCreateImage {
  imageId: string;
}

export interface ResponseGetImageListFromTag {
  images: {
    id: string;
    mediaId: string;
  }[];
}
