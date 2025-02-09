import multer from 'multer';

//S3 없이 파일을 메모리에 저장
const upload = multer({
  storage: multer.memoryStorage(), // 메모리에 저장
  limits: {fileSize: 5 * 1024 * 1024}, // 최대 5MB 제한
});

export default upload;