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
  TsoaResponse,
} from 'tsoa';
import {findTagsByDate} from '../services/tag.service.js';
import {DateToTags} from '../dtos/tag.dto.js';
import {StatusCodes} from 'http-status-codes';

@Route('tags')
export class TagsController extends Controller {
  @Get('/users/{userId}')
  @SuccessResponse('200', 'OK')
  public async getTagListWithDate(
    @Path() userId: string,
    @Query() year: number,
    @Query() month: number,
    @Query() date?: number,
  ): Promise<{tags: string[]}> {
    const dto = new DateToTags(userId, year, month, date);
    const tags = await findTagsByDate(dto)
      .then(result => {
        return {tags: result};
      })
      .catch(err => {
        err.statusCode = StatusCodes.NOT_FOUND;
        throw err;
      });
    return tags;
  }
}
