/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TagsController } from './../controllers/tsoaTag.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ImagesController } from './../controllers/tsoaImage.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MemoImageController } from './../controllers/tsoa.memo-image.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MemoFolderController } from './../controllers/tsoa.memo-folder.controller.js';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';
import multer from 'multer';




// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ITsoaSuccessResponse__tags-string-Array__": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"dataType":"nestedObjectLiteral","nestedProperties":{"tags":{"dataType":"array","array":{"dataType":"string"},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FieldErrors": {
        "dataType": "refObject",
        "properties": {
        },
        "additionalProperties": {"dataType":"nestedObjectLiteral","nestedProperties":{"value":{"dataType":"any"},"message":{"dataType":"string","required":true}}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorDetails": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"folderName":{"dataType":"string"},"userId":{"dataType":"string"},"folderId":{"dataType":"string"}}},{"dataType":"nestedObjectLiteral","nestedProperties":{"imageUrl":{"dataType":"string"},"imageId":{"dataType":"string"}}},{"dataType":"nestedObjectLiteral","nestedProperties":{"userId":{"dataType":"string"},"challengeId":{"dataType":"string"}}},{"dataType":"nestedObjectLiteral","nestedProperties":{"longitude":{"dataType":"double"},"latitude":{"dataType":"double"}}},{"dataType":"nestedObjectLiteral","nestedProperties":{"reason":{"dataType":"string"}}},{"dataType":"nestedObjectLiteral","nestedProperties":{"searchKeyword":{"dataType":"string"}}},{"ref":"FieldErrors"},{"dataType":"nestedObjectLiteral","nestedProperties":{"extension":{"dataType":"string"}}},{"dataType":"nestedObjectLiteral","nestedProperties":{"imageId":{"dataType":"array","array":{"dataType":"string"}},"folderId":{"dataType":"string"}}},{"dataType":"enum","enums":[null]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"ref":"ErrorDetails","required":true},"reason":{"dataType":"string","required":true},"errorCode":{"dataType":"string","required":true}},"required":true},
            "success": {"dataType":"enum","enums":[null],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse__id-string--mediaId-string_-Array_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"mediaId":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MemoFolderImageResponseDto": {
        "dataType": "refObject",
        "properties": {
            "folderId": {"dataType":"string","required":true},
            "folderName": {"dataType":"string","required":true},
            "imageId": {"dataType":"string","required":true},
            "imageUrl": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_MemoFolderImageResponseDto_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"MemoFolderImageResponseDto","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MemoTextImageListResponseDto": {
        "dataType": "refObject",
        "properties": {
            "folderId": {"dataType":"string","required":true},
            "folderName": {"dataType":"string","required":true},
            "imageText": {"dataType":"string","required":true},
            "images": {"dataType":"union","subSchemas":[{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"imageUrl":{"dataType":"string","required":true},"imageId":{"dataType":"string","required":true}}}},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_MemoTextImageListResponseDto_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"MemoTextImageListResponseDto","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BodyToMemoImagesToMove": {
        "dataType": "refObject",
        "properties": {
            "targetFolderId": {"dataType":"string","required":true},
            "imageId": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseMessage": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_ResponseMessage_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"ResponseMessage","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MemoFolderResponseDto": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "folderName": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_MemoFolderResponseDto_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"MemoFolderResponseDto","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BodyToMemoFolder": {
        "dataType": "refObject",
        "properties": {
            "folderName": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MemoFolderListResponseDto": {
        "dataType": "refObject",
        "properties": {
            "folderId": {"dataType":"string","required":true},
            "folderName": {"dataType":"string","required":true},
            "imageText": {"dataType":"string","required":true},
            "imageCount": {"dataType":"double","required":true},
            "firstImageId": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "firstImageUrl": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "createdAt": {"dataType":"datetime","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse__data-MemoFolderListResponseDto-Array__": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"dataType":"nestedObjectLiteral","nestedProperties":{"data":{"dataType":"array","array":{"dataType":"refObject","ref":"MemoFolderListResponseDto"},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BodyToMemoImagesToDelete": {
        "dataType": "refObject",
        "properties": {
            "imageId": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BodyToMemoTextToUpdate": {
        "dataType": "refObject",
        "properties": {
            "memoText": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router,opts?:{multer?:ReturnType<typeof multer>}) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const upload = opts?.multer ||  multer({"limits":{"fileSize":8388608}});

    
        const argsTagsController_getTagListWithDate: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                year: {"in":"query","name":"year","required":true,"dataType":"double"},
                month: {"in":"query","name":"month","required":true,"dataType":"double"},
                date: {"in":"query","name":"date","dataType":"double"},
        };
        app.get('/tags/date',
            ...(fetchMiddlewares<RequestHandler>(TagsController)),
            ...(fetchMiddlewares<RequestHandler>(TagsController.prototype.getTagListWithDate)),

            async function TagsController_getTagListWithDate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTagsController_getTagListWithDate, request, response });

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
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsImagesController_getImageListFromTag: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                tag: {"in":"query","name":"tag","required":true,"dataType":"string"},
        };
        app.get('/images',
            ...(fetchMiddlewares<RequestHandler>(ImagesController)),
            ...(fetchMiddlewares<RequestHandler>(ImagesController.prototype.getImageListFromTag)),

            async function ImagesController_getImageListFromTag(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsImagesController_getImageListFromTag, request, response });

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
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMemoImageController_handlerMemoImageAdd: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                targetFolderId: {"in":"path","name":"folderId","required":true,"dataType":"string"},
                image: {"in":"formData","name":"image","required":true,"dataType":"file"},
        };
        app.post('/memo/image-format/folders/:folderId',
            upload.fields([
                {
                    name: "image",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(MemoImageController)),
            ...(fetchMiddlewares<RequestHandler>(MemoImageController.prototype.handlerMemoImageAdd)),

            async function MemoImageController_handlerMemoImageAdd(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoImageController_handlerMemoImageAdd, request, response });

                const controller = new MemoImageController();

              await templateService.apiHandler({
                methodName: 'handlerMemoImageAdd',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMemoImageController_handlerMemoImageMove: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                currentFolderId: {"in":"path","name":"folderId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"BodyToMemoImagesToMove"},
        };
        app.patch('/memo/folders/:folderId/images',
            ...(fetchMiddlewares<RequestHandler>(MemoImageController)),
            ...(fetchMiddlewares<RequestHandler>(MemoImageController.prototype.handlerMemoImageMove)),

            async function MemoImageController_handlerMemoImageMove(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoImageController_handlerMemoImageMove, request, response });

                const controller = new MemoImageController();

              await templateService.apiHandler({
                methodName: 'handlerMemoImageMove',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMemoImageController_handlerMemoFolderDelete: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                targetFolderId: {"in":"path","name":"folderId","required":true,"dataType":"string"},
        };
        app.delete('/memo/folders/:folderId',
            ...(fetchMiddlewares<RequestHandler>(MemoImageController)),
            ...(fetchMiddlewares<RequestHandler>(MemoImageController.prototype.handlerMemoFolderDelete)),

            async function MemoImageController_handlerMemoFolderDelete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoImageController_handlerMemoFolderDelete, request, response });

                const controller = new MemoImageController();

              await templateService.apiHandler({
                methodName: 'handlerMemoFolderDelete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMemoFolderController_handlerMemoFolderImageAdd: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                folderName: {"in":"formData","name":"folderName","required":true,"dataType":"string"},
                image: {"in":"formData","name":"image","required":true,"dataType":"file"},
        };
        app.post('/memo/image-format/folders',
            upload.fields([
                {
                    name: "image",
                    maxCount: 1
                }
            ]),
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController)),
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController.prototype.handlerMemoFolderImageAdd)),

            async function MemoFolderController_handlerMemoFolderImageAdd(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoFolderController_handlerMemoFolderImageAdd, request, response });

                const controller = new MemoFolderController();

              await templateService.apiHandler({
                methodName: 'handlerMemoFolderImageAdd',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMemoFolderController_handlerMemoFolderAdd: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"BodyToMemoFolder"},
        };
        app.post('/memo/folders',
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController)),
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController.prototype.handlerMemoFolderAdd)),

            async function MemoFolderController_handlerMemoFolderAdd(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoFolderController_handlerMemoFolderAdd, request, response });

                const controller = new MemoFolderController();

              await templateService.apiHandler({
                methodName: 'handlerMemoFolderAdd',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMemoFolderController_handlerMemoFolderList: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/memo/list',
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController)),
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController.prototype.handlerMemoFolderList)),

            async function MemoFolderController_handlerMemoFolderList(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoFolderController_handlerMemoFolderList, request, response });

                const controller = new MemoFolderController();

              await templateService.apiHandler({
                methodName: 'handlerMemoFolderList',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMemoFolderController_handlerMemoSearch: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                keyword: {"in":"query","name":"keyword","required":true,"dataType":"string"},
        };
        app.get('/memo/search',
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController)),
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController.prototype.handlerMemoSearch)),

            async function MemoFolderController_handlerMemoSearch(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoFolderController_handlerMemoSearch, request, response });

                const controller = new MemoFolderController();

              await templateService.apiHandler({
                methodName: 'handlerMemoSearch',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMemoFolderController_handlerMemoImageDelete: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                folderIdParam: {"in":"path","name":"folderId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"BodyToMemoImagesToDelete"},
        };
        app.post('/memo/folders/:folderId/images/delete',
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController)),
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController.prototype.handlerMemoImageDelete)),

            async function MemoFolderController_handlerMemoImageDelete(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoFolderController_handlerMemoImageDelete, request, response });

                const controller = new MemoFolderController();

              await templateService.apiHandler({
                methodName: 'handlerMemoImageDelete',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMemoFolderController_handlerMemoTextImageList: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                folderIdParam: {"in":"path","name":"folderId","required":true,"dataType":"string"},
        };
        app.get('/memo/folders/:folderId',
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController)),
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController.prototype.handlerMemoTextImageList)),

            async function MemoFolderController_handlerMemoTextImageList(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoFolderController_handlerMemoTextImageList, request, response });

                const controller = new MemoFolderController();

              await templateService.apiHandler({
                methodName: 'handlerMemoTextImageList',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMemoFolderController_handlerMemoFolderUpdate: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                folderIdParam: {"in":"path","name":"folderId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"BodyToMemoFolder"},
        };
        app.patch('/memo/folders/:folderId',
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController)),
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController.prototype.handlerMemoFolderUpdate)),

            async function MemoFolderController_handlerMemoFolderUpdate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoFolderController_handlerMemoFolderUpdate, request, response });

                const controller = new MemoFolderController();

              await templateService.apiHandler({
                methodName: 'handlerMemoFolderUpdate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMemoFolderController_handlerMemoTextUpdate: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                folderIdParam: {"in":"path","name":"folderId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"BodyToMemoTextToUpdate"},
        };
        app.patch('/memo/folders/:folderId/text',
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController)),
            ...(fetchMiddlewares<RequestHandler>(MemoFolderController.prototype.handlerMemoTextUpdate)),

            async function MemoFolderController_handlerMemoTextUpdate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoFolderController_handlerMemoTextUpdate, request, response });

                const controller = new MemoFolderController();

              await templateService.apiHandler({
                methodName: 'handlerMemoTextUpdate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
