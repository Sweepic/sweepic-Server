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
import {BaseError, ServerError} from '../errors.js';
import {Response} from '../models/tsoaResponse.js';

@Route('images')
export class ImagesController extends Controller {
  @Get('/users/{userId}')
  @Tags('Image')
  @SuccessResponse('200', 'OK')
  public async getImageListFromTag(
    @Path() userId: string,
    @Query() tag: string,
  ): Promise<Response> {
    const dto = new RequestTagSearch(tag, userId);
    const images = await findImagesFromTag(dto).catch(err => {
      if (err instanceof BaseError) {
        throw err;
      } else {
        throw new ServerError();
      }
    });

    return new Response(images);
  }
}
