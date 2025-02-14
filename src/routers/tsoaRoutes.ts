/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controllers/user.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MypageController } from './../controllers/user.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TagsController } from './../controllers/tsoaTag.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ImagesController } from './../controllers/tsoaImage.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MemoImageController } from './../controllers/tsoa.memo-image.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MemoFolderController } from './../controllers/tsoa.memo-folder.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MemoCreateFolderOCRController } from './../controllers/memo-updateFolderOCR.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MemoCreateUpdateOCRController } from './../controllers/memo-createFolderOCR.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MostTaggedController } from './../controllers/history.controller.js';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AwardController } from './../controllers/history.controller.js';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ResponseUser": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "goalCount": {"dataType":"double","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
            "status": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_ResponseUser_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"ResponseUser","required":true},
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
    "ITsoaSuccessResponse_string_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseTagListWithDate": {
        "dataType": "refObject",
        "properties": {
            "tags": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_ResponseTagListWithDate_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"ResponseTagListWithDate","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseTagListFromImage": {
        "dataType": "refObject",
        "properties": {
            "tags": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"tagCategory":{"dataType":"nestedObjectLiteral","nestedProperties":{"tagType":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},"content":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_ResponseTagListFromImage_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"ResponseTagListFromImage","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseCreationTags": {
        "dataType": "refObject",
        "properties": {
            "tags": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"tagId":{"dataType":"string","required":true},"imageId":{"dataType":"string","required":true},"status":{"dataType":"double","required":true},"updatedAt":{"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},"createdAt":{"dataType":"datetime","required":true},"id":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_ResponseCreationTags_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"ResponseCreationTags","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RequestBodyCreationTags": {
        "dataType": "refObject",
        "properties": {
            "tags": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"tagCategoryId":{"dataType":"string","required":true},"content":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse__labels_58__description-string--score-number_-Array__": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"dataType":"nestedObjectLiteral","nestedProperties":{"labels":{"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"score":{"dataType":"double","required":true},"description":{"dataType":"string","required":true}}},"required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseGetImageListFromTag": {
        "dataType": "refObject",
        "properties": {
            "images": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"mediaId":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_ResponseGetImageListFromTag_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"ResponseGetImageListFromTag","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseCreateImage": {
        "dataType": "refObject",
        "properties": {
            "imageId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_ResponseCreateImage_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"ResponseCreateImage","required":true},
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
    "ITsoaSuccessResponse__folder_id-string--image_text-string__": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"dataType":"nestedObjectLiteral","nestedProperties":{"image_text":{"dataType":"string","required":true},"folder_id":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseFromMostTagToClient": {
        "dataType": "refObject",
        "properties": {
            "_count": {"dataType":"nestedObjectLiteral","nestedProperties":{"_all":{"dataType":"double","required":true}},"required":true},
            "tagCategoryId": {"dataType":"string","required":true},
            "content": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_ResponseFromMostTagToClient-Array_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"dataType":"array","array":{"dataType":"refObject","ref":"ResponseFromMostTagToClient"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseFromAward": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "awardMonth": {"dataType":"datetime","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
            "status": {"dataType":"double","required":true},
            "userId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_ResponseFromAward_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"ref":"ResponseFromAward","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResponseFromUpdateAward": {
        "dataType": "refObject",
        "properties": {
            "imageId": {"dataType":"string","required":true},
            "createdAt": {"dataType":"datetime","required":true},
            "updatedAt": {"dataType":"union","subSchemas":[{"dataType":"datetime"},{"dataType":"enum","enums":[null]}],"required":true},
            "status": {"dataType":"double","required":true},
            "awardId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_ResponseFromUpdateAward-Array_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"dataType":"array","array":{"dataType":"refObject","ref":"ResponseFromUpdateAward"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ITsoaSuccessResponse_ResponseFromAward-Array_": {
        "dataType": "refObject",
        "properties": {
            "resultType": {"dataType":"string","required":true},
            "error": {"dataType":"enum","enums":[null],"required":true},
            "success": {"dataType":"array","array":{"dataType":"refObject","ref":"ResponseFromAward"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsUserController_updateUserName: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true}}},
        };
        app.patch('/onboarding/name',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateUserName)),

            async function UserController_updateUserName(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateUserName, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateUserName',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_updateUserGoalCount: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"goalCount":{"dataType":"double","required":true}}},
        };
        app.patch('/onboarding/goal',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateUserGoalCount)),

            async function UserController_updateUserGoalCount(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateUserGoalCount, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateUserGoalCount',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMypageController_getUser: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/user/mypage',
            ...(fetchMiddlewares<RequestHandler>(MypageController)),
            ...(fetchMiddlewares<RequestHandler>(MypageController.prototype.getUser)),

            async function MypageController_getUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMypageController_getUser, request, response });

                const controller = new MypageController();

              await templateService.apiHandler({
                methodName: 'getUser',
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
        const argsMypageController_logOut: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.patch('/user/mypage/logout',
            ...(fetchMiddlewares<RequestHandler>(MypageController)),
            ...(fetchMiddlewares<RequestHandler>(MypageController.prototype.logOut)),

            async function MypageController_logOut(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMypageController_logOut, request, response });

                const controller = new MypageController();

              await templateService.apiHandler({
                methodName: 'logOut',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMypageController_deleteUser: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.patch('/user/mypage',
            ...(fetchMiddlewares<RequestHandler>(MypageController)),
            ...(fetchMiddlewares<RequestHandler>(MypageController.prototype.deleteUser)),

            async function MypageController_deleteUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMypageController_deleteUser, request, response });

                const controller = new MypageController();

              await templateService.apiHandler({
                methodName: 'deleteUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
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
        const argsTagsController_getTagListFromImage: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                mediaId: {"in":"path","name":"mediaId","required":true,"dataType":"double"},
        };
        app.get('/tags/images/:mediaId',
            ...(fetchMiddlewares<RequestHandler>(TagsController)),
            ...(fetchMiddlewares<RequestHandler>(TagsController.prototype.getTagListFromImage)),

            async function TagsController_getTagListFromImage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTagsController_getTagListFromImage, request, response });

                const controller = new TagsController();

              await templateService.apiHandler({
                methodName: 'getTagListFromImage',
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
        const argsTagsController_postTag: Record<string, TsoaRoute.ParameterSchema> = {
                imageId: {"in":"path","name":"imageId","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"RequestBodyCreationTags"},
        };
        app.post('/tags/images/:imageId',
            ...(fetchMiddlewares<RequestHandler>(TagsController)),
            ...(fetchMiddlewares<RequestHandler>(TagsController.prototype.postTag)),

            async function TagsController_postTag(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTagsController_postTag, request, response });

                const controller = new TagsController();

              await templateService.apiHandler({
                methodName: 'postTag',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTagsController_getLableFromImage: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/tags/ai',
            ...(fetchMiddlewares<RequestHandler>(TagsController)),
            ...(fetchMiddlewares<RequestHandler>(TagsController.prototype.getLableFromImage)),

            async function TagsController_getLableFromImage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTagsController_getLableFromImage, request, response });

                const controller = new TagsController();

              await templateService.apiHandler({
                methodName: 'getLableFromImage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
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
        const argsImagesController_createImage: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"timestamp":{"dataType":"datetime","required":true},"mediaId":{"dataType":"string","required":true}}},
        };
        app.post('/images',
            ...(fetchMiddlewares<RequestHandler>(ImagesController)),
            ...(fetchMiddlewares<RequestHandler>(ImagesController.prototype.createImage)),

            async function ImagesController_createImage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsImagesController_createImage, request, response });

                const controller = new ImagesController();

              await templateService.apiHandler({
                methodName: 'createImage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMemoImageController_handlerMemoImageAdd: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                targetFolderId: {"in":"path","name":"folderId","required":true,"dataType":"string"},
        };
        app.post('/memo/image-format/folders/:folderId',
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
        };
        app.post('/memo/image-format/folders',
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
        const argsMemoCreateFolderOCRController_updateFolderOCR: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                folderId: {"in":"path","name":"folderId","required":true,"dataType":"double"},
        };
        app.patch('/memo/text-format/folders/:folderId',
            ...(fetchMiddlewares<RequestHandler>(MemoCreateFolderOCRController)),
            ...(fetchMiddlewares<RequestHandler>(MemoCreateFolderOCRController.prototype.updateFolderOCR)),

            async function MemoCreateFolderOCRController_updateFolderOCR(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoCreateFolderOCRController_updateFolderOCR, request, response });

                const controller = new MemoCreateFolderOCRController();

              await templateService.apiHandler({
                methodName: 'updateFolderOCR',
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
        const argsMemoCreateUpdateOCRController_createFolderOCR: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                folderName: {"in":"formData","name":"folder_name","required":true,"dataType":"string"},
        };
        app.post('/memo/text-format/folders',
            ...(fetchMiddlewares<RequestHandler>(MemoCreateUpdateOCRController)),
            ...(fetchMiddlewares<RequestHandler>(MemoCreateUpdateOCRController.prototype.createFolderOCR)),

            async function MemoCreateUpdateOCRController_createFolderOCR(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMemoCreateUpdateOCRController_createFolderOCR, request, response });

                const controller = new MemoCreateUpdateOCRController();

              await templateService.apiHandler({
                methodName: 'createFolderOCR',
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
        const argsMostTaggedController_getMostTagged: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/user/history/most_tagged/get',
            ...(fetchMiddlewares<RequestHandler>(MostTaggedController)),
            ...(fetchMiddlewares<RequestHandler>(MostTaggedController.prototype.getMostTagged)),

            async function MostTaggedController_getMostTagged(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMostTaggedController_getMostTagged, request, response });

                const controller = new MostTaggedController();

              await templateService.apiHandler({
                methodName: 'getMostTagged',
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
        const argsAwardController_createNewAward: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/user/history/award/create',
            ...(fetchMiddlewares<RequestHandler>(AwardController)),
            ...(fetchMiddlewares<RequestHandler>(AwardController.prototype.createNewAward)),

            async function AwardController_createNewAward(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAwardController_createNewAward, request, response });

                const controller = new AwardController();

              await templateService.apiHandler({
                methodName: 'createNewAward',
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
        const argsAwardController_modifyAward: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                awardId: {"in":"query","name":"awardId","required":true,"dataType":"string"},
        };
        app.patch('/user/history/award/modify',
            ...(fetchMiddlewares<RequestHandler>(AwardController)),
            ...(fetchMiddlewares<RequestHandler>(AwardController.prototype.modifyAward)),

            async function AwardController_modifyAward(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAwardController_modifyAward, request, response });

                const controller = new AwardController();

              await templateService.apiHandler({
                methodName: 'modifyAward',
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
        const argsAwardController_getAward: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/user/history/award/get',
            ...(fetchMiddlewares<RequestHandler>(AwardController)),
            ...(fetchMiddlewares<RequestHandler>(AwardController.prototype.getAward)),

            async function AwardController_getAward(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAwardController_getAward, request, response });

                const controller = new AwardController();

              await templateService.apiHandler({
                methodName: 'getAward',
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
