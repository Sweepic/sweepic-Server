import {Controller, Get, Path, Query, Route, SuccessResponse, Tags} from 'tsoa';
import {findTagsByDate} from '../services/tsoaTag.service.js';
import {DateToTags} from '../dtos/tsoaTag.dto.js';
import {BaseError, ServerError} from '../errors.js';
import {Response} from '../models/tsoaResponse.js';

@Route('tags')
export class TagsController extends Controller {
  @Get('/users/{userId}')
  @Tags('Tag')
  @SuccessResponse('200', 'OK')
  public async getTagListWithDate(
    @Path() userId: string,
    @Query() year: number,
    @Query() month: number,
    @Query() date?: number,
  ): Promise<Response> {
    const dto = new DateToTags(userId, year, month, date);
    const tags = await findTagsByDate(dto)
      .then(result => {
        return {tags: result};
      })
      .catch(err => {
        if (!(err instanceof BaseError)) {
          throw new ServerError();
        } else {
          throw err;
        }
      });

    return new Response(tags);
  }
}
