/* tslint:disable */

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type {TsoaRoute} from '@tsoa/runtime';
import {fetchMiddlewares, ExpressTemplateService} from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {TagsController} from './../controllers/tsoaTag.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {ImagesController} from '../controllers/tsoaImage.controller.js';
import type {
  Request as ExRequest,
  Response as ExResponse,
  RequestHandler,
  Router,
} from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {};
const templateService = new ExpressTemplateService(models, {
  noImplicitAdditionalProperties: 'throw-on-extras',
  bodyCoercion: true,
});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################

  const argsTagsController_getTagListWithDate: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    userId: {in: 'path', name: 'userId', required: true, dataType: 'string'},
    year: {in: 'query', name: 'year', required: true, dataType: 'double'},
    month: {in: 'query', name: 'month', required: true, dataType: 'double'},
    date: {in: 'query', name: 'date', dataType: 'double'},
  };
  app.get(
    '/tags/users/:userId',
    ...fetchMiddlewares<RequestHandler>(TagsController),
    ...fetchMiddlewares<RequestHandler>(
      TagsController.prototype.getTagListWithDate,
    ),

    async function TagsController_getTagListWithDate(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsTagsController_getTagListWithDate,
          request,
          response,
        });

        const controller = new TagsController();

        await templateService.apiHandler({
          methodName: 'getTagListWithDate',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsImagesController_getImageListFromTag: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    userId: {in: 'path', name: 'userId', required: true, dataType: 'string'},
    tag: {in: 'query', name: 'tag', required: true, dataType: 'string'},
  };
  app.get(
    '/images/users/:userId',
    ...fetchMiddlewares<RequestHandler>(ImagesController),
    ...fetchMiddlewares<RequestHandler>(
      ImagesController.prototype.getImageListFromTag,
    ),

    async function ImagesController_getImageListFromTag(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsImagesController_getImageListFromTag,
          request,
          response,
        });

        const controller = new ImagesController();

        await templateService.apiHandler({
          methodName: 'getImageListFromTag',
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
