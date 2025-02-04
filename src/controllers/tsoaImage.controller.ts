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
} from 'tsoa';
import {RequestTagSearch} from '../dtos/tsoaImage.dto.js';
import {findImagesFromTag} from '../services/tsoaImage.service.js';
import {BaseError, ServerError} from '../errors.js';
import {
  ITsoaErrorResponse,
  ITsoaSuccessResponse,
  TsoaSuccessResponse,
} from '../models/tsoaResponse.js';

@Route('images')
export class ImagesController extends Controller {
  @Get('/users/{userId}')
  @Tags('Image')
  @SuccessResponse('200', 'OK')
  public async getImageListFromTag(
    @Path() userId: string,
    @Query() tag: string,
  ): Promise<ITsoaSuccessResponse<{id: string; mediaId: string}[]>> {
    const dto = new RequestTagSearch(tag, userId);
    const images = await findImagesFromTag(dto).catch(err => {
      if (err instanceof BaseError) {
        throw err;
      } else {
        throw new ServerError();
      }
    });

    return new TsoaSuccessResponse(images);
  }
}
