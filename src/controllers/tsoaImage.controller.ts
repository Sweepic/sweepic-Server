import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Res,
  Route,
  SuccessResponse,
  Tags,
  TsoaResponse,
} from 'tsoa';
import {RequestTagSearch} from '../dtos/tsoaImage.dto.js';
import {findImagesFromTag} from '../services/tsoaImage.service.js';
import {StatusCodes} from 'http-status-codes';

@Route('images')
export class ImagesController extends Controller {
  @Get('/users/{userId}')
  @Tags('Image')
  @SuccessResponse('200', 'OK')
  public async getImageListFromTag(
    @Path() userId: string,
    @Query() tag: string,
  ): Promise<{id: string; mediaId: string}[]> {
    const dto = new RequestTagSearch(tag, userId);
    console.log(dto);
    const images = await findImagesFromTag(dto).catch(err => {
      err.statusCode = StatusCodes.NOT_FOUND;
      throw err;
    });

    return images;
  }
}
