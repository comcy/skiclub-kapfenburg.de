/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TilesController } from './../controllers/tiles-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GymCourseController } from './../controllers/gym-course-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EventRegistrationController } from './../controllers/event-registration-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TripRegistrationController } from './../controllers/event-registration-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EventController } from './../controllers/event-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CourseRegistrationController } from './../controllers/course-registration-controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BoardingsController } from './../controllers/boardings-controller';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "TileType": {
        "dataType": "refEnum",
        "enums": ["info","event","course"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TileStatus": {
        "dataType": "refEnum",
        "enums": ["open","canceled","bookedUp"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TileBehavior": {
        "dataType": "refEnum",
        "enums": ["view","click"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TileActions": {
        "dataType": "refEnum",
        "enums": ["share","register","download"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Tile": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "order": {"dataType":"double","required":true},
            "type": {"ref":"TileType","required":true},
            "title": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "subTitle": {"dataType":"string","required":true},
            "image": {"dataType":"string","required":true},
            "imageId": {"dataType":"string"},
            "imageDescription": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "status": {"ref":"TileStatus","required":true},
            "expiration": {"dataType":"string","required":true},
            "behavior": {"ref":"TileBehavior","required":true},
            "boardings": {"dataType":"array","array":{"dataType":"string"}},
            "actions": {"dataType":"array","array":{"dataType":"refEnum","ref":"TileActions"}},
            "downloadActionLink": {"dataType":"string"},
            "avatar": {"dataType":"string"},
            "visible": {"dataType":"boolean"},
            "expired": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_Tile_": {
        "dataType": "refObject",
        "properties": {
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"Tile"},"required":true},
            "total": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Tile.Exclude_keyofTile.id__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"order":{"dataType":"double","required":true},"type":{"ref":"TileType","required":true},"title":{"dataType":"string","required":true},"date":{"dataType":"string","required":true},"subTitle":{"dataType":"string","required":true},"image":{"dataType":"string","required":true},"imageId":{"dataType":"string"},"imageDescription":{"dataType":"string","required":true},"description":{"dataType":"string","required":true},"status":{"ref":"TileStatus","required":true},"expiration":{"dataType":"string","required":true},"behavior":{"ref":"TileBehavior","required":true},"boardings":{"dataType":"array","array":{"dataType":"string"}},"actions":{"dataType":"array","array":{"dataType":"refEnum","ref":"TileActions"}},"downloadActionLink":{"dataType":"string"},"avatar":{"dataType":"string"},"visible":{"dataType":"boolean"},"expired":{"dataType":"boolean"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Tile.id_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Tile.Exclude_keyofTile.id__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TileCreationParams": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_Tile.id_","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_Tile_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"string"},"order":{"dataType":"double"},"type":{"ref":"TileType"},"title":{"dataType":"string"},"date":{"dataType":"string"},"subTitle":{"dataType":"string"},"image":{"dataType":"string"},"imageId":{"dataType":"string"},"imageDescription":{"dataType":"string"},"description":{"dataType":"string"},"status":{"ref":"TileStatus"},"expiration":{"dataType":"string"},"behavior":{"ref":"TileBehavior"},"boardings":{"dataType":"array","array":{"dataType":"string"}},"actions":{"dataType":"array","array":{"dataType":"refEnum","ref":"TileActions"}},"downloadActionLink":{"dataType":"string"},"avatar":{"dataType":"string"},"visible":{"dataType":"boolean"},"expired":{"dataType":"boolean"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Trip": {
        "dataType": "refObject",
        "properties": {
            "destination": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "availableBoardings": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TripParticipant": {
        "dataType": "refObject",
        "properties": {
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "birthday": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "boarding": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TripRegisterFormValue": {
        "dataType": "refObject",
        "properties": {
            "trip": {"ref":"Trip","required":true},
            "additionalText": {"dataType":"string","required":true},
            "participants": {"dataType":"array","array":{"dataType":"refObject","ref":"TripParticipant"},"required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CourseRegisterFormFields": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string"},
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "sportType": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "age": {"dataType":"string","required":true},
            "additionalText": {"dataType":"string","required":true},
            "level": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_CourseRegisterFormFields_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"id":{"dataType":"string"},"firstName":{"dataType":"string"},"lastName":{"dataType":"string"},"sportType":{"dataType":"string"},"email":{"dataType":"string"},"phone":{"dataType":"string"},"age":{"dataType":"string"},"additionalText":{"dataType":"string"},"level":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Boarding": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginatedResponse_Boarding_": {
        "dataType": "refObject",
        "properties": {
            "items": {"dataType":"array","array":{"dataType":"refObject","ref":"Boarding"},"required":true},
            "total": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Pick_Boarding.Exclude_keyofBoarding.id__": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"name":{"dataType":"string","required":true}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Omit_Boarding.id_": {
        "dataType": "refAlias",
        "type": {"ref":"Pick_Boarding.Exclude_keyofBoarding.id__","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BoardingCreationParams": {
        "dataType": "refAlias",
        "type": {"ref":"Omit_Boarding.id_","validators":{}},
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


    
        const argsTilesController_getTiles: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
                sort: {"default":"order","in":"query","name":"sort","dataType":"string"},
                direction: {"default":"asc","in":"query","name":"direction","dataType":"union","subSchemas":[{"dataType":"enum","enums":["asc"]},{"dataType":"enum","enums":["desc"]}]},
                search: {"in":"query","name":"search","dataType":"string"},
                type: {"in":"query","name":"type","dataType":"string"},
                status: {"in":"query","name":"status","dataType":"string"},
        };
        app.get('/tiles',
            ...(fetchMiddlewares<RequestHandler>(TilesController)),
            ...(fetchMiddlewares<RequestHandler>(TilesController.prototype.getTiles)),

            async function TilesController_getTiles(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTilesController_getTiles, request, response });

                const controller = new TilesController();

              await templateService.apiHandler({
                methodName: 'getTiles',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTilesController_getTile: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/tiles/:id',
            ...(fetchMiddlewares<RequestHandler>(TilesController)),
            ...(fetchMiddlewares<RequestHandler>(TilesController.prototype.getTile)),

            async function TilesController_getTile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTilesController_getTile, request, response });

                const controller = new TilesController();

              await templateService.apiHandler({
                methodName: 'getTile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTilesController_createTile: Record<string, TsoaRoute.ParameterSchema> = {
                tile: {"in":"body","name":"tile","required":true,"ref":"TileCreationParams"},
        };
        app.post('/tiles',
            ...(fetchMiddlewares<RequestHandler>(TilesController)),
            ...(fetchMiddlewares<RequestHandler>(TilesController.prototype.createTile)),

            async function TilesController_createTile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTilesController_createTile, request, response });

                const controller = new TilesController();

              await templateService.apiHandler({
                methodName: 'createTile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTilesController_updateTile: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                tile: {"in":"body","name":"tile","required":true,"ref":"Tile"},
        };
        app.put('/tiles/:id',
            ...(fetchMiddlewares<RequestHandler>(TilesController)),
            ...(fetchMiddlewares<RequestHandler>(TilesController.prototype.updateTile)),

            async function TilesController_updateTile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTilesController_updateTile, request, response });

                const controller = new TilesController();

              await templateService.apiHandler({
                methodName: 'updateTile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTilesController_deleteTile: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/tiles/:id',
            ...(fetchMiddlewares<RequestHandler>(TilesController)),
            ...(fetchMiddlewares<RequestHandler>(TilesController.prototype.deleteTile)),

            async function TilesController_deleteTile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTilesController_deleteTile, request, response });

                const controller = new TilesController();

              await templateService.apiHandler({
                methodName: 'deleteTile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGymCourseController_createGymCourse: Record<string, TsoaRoute.ParameterSchema> = {
                courseData: {"in":"body","name":"courseData","required":true,"ref":"Tile"},
        };
        app.post('/gym-courses',
            ...(fetchMiddlewares<RequestHandler>(GymCourseController)),
            ...(fetchMiddlewares<RequestHandler>(GymCourseController.prototype.createGymCourse)),

            async function GymCourseController_createGymCourse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGymCourseController_createGymCourse, request, response });

                const controller = new GymCourseController();

              await templateService.apiHandler({
                methodName: 'createGymCourse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGymCourseController_getGymCourses: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/gym-courses',
            ...(fetchMiddlewares<RequestHandler>(GymCourseController)),
            ...(fetchMiddlewares<RequestHandler>(GymCourseController.prototype.getGymCourses)),

            async function GymCourseController_getGymCourses(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGymCourseController_getGymCourses, request, response });

                const controller = new GymCourseController();

              await templateService.apiHandler({
                methodName: 'getGymCourses',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGymCourseController_getGymCourseById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/gym-courses/:id',
            ...(fetchMiddlewares<RequestHandler>(GymCourseController)),
            ...(fetchMiddlewares<RequestHandler>(GymCourseController.prototype.getGymCourseById)),

            async function GymCourseController_getGymCourseById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGymCourseController_getGymCourseById, request, response });

                const controller = new GymCourseController();

              await templateService.apiHandler({
                methodName: 'getGymCourseById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGymCourseController_updateGymCourse: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                courseData: {"in":"body","name":"courseData","required":true,"ref":"Partial_Tile_"},
        };
        app.put('/gym-courses/:id',
            ...(fetchMiddlewares<RequestHandler>(GymCourseController)),
            ...(fetchMiddlewares<RequestHandler>(GymCourseController.prototype.updateGymCourse)),

            async function GymCourseController_updateGymCourse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGymCourseController_updateGymCourse, request, response });

                const controller = new GymCourseController();

              await templateService.apiHandler({
                methodName: 'updateGymCourse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsGymCourseController_deleteGymCourse: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/gym-courses/:id',
            ...(fetchMiddlewares<RequestHandler>(GymCourseController)),
            ...(fetchMiddlewares<RequestHandler>(GymCourseController.prototype.deleteGymCourse)),

            async function GymCourseController_deleteGymCourse(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsGymCourseController_deleteGymCourse, request, response });

                const controller = new GymCourseController();

              await templateService.apiHandler({
                methodName: 'deleteGymCourse',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEventRegistrationController_createEventRegistration: Record<string, TsoaRoute.ParameterSchema> = {
                eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
                registrationData: {"in":"body","name":"registrationData","required":true,"ref":"TripRegisterFormValue"},
        };
        app.post('/event-registrations/:eventId',
            ...(fetchMiddlewares<RequestHandler>(EventRegistrationController)),
            ...(fetchMiddlewares<RequestHandler>(EventRegistrationController.prototype.createEventRegistration)),

            async function EventRegistrationController_createEventRegistration(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEventRegistrationController_createEventRegistration, request, response });

                const controller = new EventRegistrationController();

              await templateService.apiHandler({
                methodName: 'createEventRegistration',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEventRegistrationController_getEventRegistrations: Record<string, TsoaRoute.ParameterSchema> = {
                eventId: {"in":"path","name":"eventId","required":true,"dataType":"string"},
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
                sort: {"in":"query","name":"sort","dataType":"string"},
                filter: {"in":"query","name":"filter","dataType":"string"},
                sportTypeFilter: {"in":"query","name":"sportTypeFilter","dataType":"string"},
        };
        app.get('/event-registrations/:eventId',
            ...(fetchMiddlewares<RequestHandler>(EventRegistrationController)),
            ...(fetchMiddlewares<RequestHandler>(EventRegistrationController.prototype.getEventRegistrations)),

            async function EventRegistrationController_getEventRegistrations(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEventRegistrationController_getEventRegistrations, request, response });

                const controller = new EventRegistrationController();

              await templateService.apiHandler({
                methodName: 'getEventRegistrations',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEventRegistrationController_getEventRegistrationById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/event-registrations/by-id/:id',
            ...(fetchMiddlewares<RequestHandler>(EventRegistrationController)),
            ...(fetchMiddlewares<RequestHandler>(EventRegistrationController.prototype.getEventRegistrationById)),

            async function EventRegistrationController_getEventRegistrationById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEventRegistrationController_getEventRegistrationById, request, response });

                const controller = new EventRegistrationController();

              await templateService.apiHandler({
                methodName: 'getEventRegistrationById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsTripRegistrationController_getTripRegistrations: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
                sort: {"in":"query","name":"sort","dataType":"string"},
                filter: {"in":"query","name":"filter","dataType":"string"},
                sportTypeFilter: {"in":"query","name":"sportTypeFilter","dataType":"string"},
        };
        app.get('/trip-registrations',
            ...(fetchMiddlewares<RequestHandler>(TripRegistrationController)),
            ...(fetchMiddlewares<RequestHandler>(TripRegistrationController.prototype.getTripRegistrations)),

            async function TripRegistrationController_getTripRegistrations(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsTripRegistrationController_getTripRegistrations, request, response });

                const controller = new TripRegistrationController();

              await templateService.apiHandler({
                methodName: 'getTripRegistrations',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEventController_createEvent: Record<string, TsoaRoute.ParameterSchema> = {
                eventData: {"in":"body","name":"eventData","required":true,"ref":"Tile"},
        };
        app.post('/events',
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.createEvent)),

            async function EventController_createEvent(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEventController_createEvent, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'createEvent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEventController_getEvents: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/events',
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.getEvents)),

            async function EventController_getEvents(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEventController_getEvents, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'getEvents',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEventController_getEventById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/events/:id',
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.getEventById)),

            async function EventController_getEventById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEventController_getEventById, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'getEventById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEventController_updateEvent: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                eventData: {"in":"body","name":"eventData","required":true,"ref":"Partial_Tile_"},
        };
        app.put('/events/:id',
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.updateEvent)),

            async function EventController_updateEvent(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEventController_updateEvent, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'updateEvent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEventController_deleteEvent: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/events/:id',
            ...(fetchMiddlewares<RequestHandler>(EventController)),
            ...(fetchMiddlewares<RequestHandler>(EventController.prototype.deleteEvent)),

            async function EventController_deleteEvent(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEventController_deleteEvent, request, response });

                const controller = new EventController();

              await templateService.apiHandler({
                methodName: 'deleteEvent',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCourseRegistrationController_createCourseRegistration: Record<string, TsoaRoute.ParameterSchema> = {
                registrationData: {"in":"body","name":"registrationData","required":true,"ref":"CourseRegisterFormFields"},
        };
        app.post('/course-registrations',
            ...(fetchMiddlewares<RequestHandler>(CourseRegistrationController)),
            ...(fetchMiddlewares<RequestHandler>(CourseRegistrationController.prototype.createCourseRegistration)),

            async function CourseRegistrationController_createCourseRegistration(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCourseRegistrationController_createCourseRegistration, request, response });

                const controller = new CourseRegistrationController();

              await templateService.apiHandler({
                methodName: 'createCourseRegistration',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCourseRegistrationController_getCourseRegistrations: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
                sort: {"in":"query","name":"sort","dataType":"string"},
                filter: {"in":"query","name":"filter","dataType":"string"},
                sportType: {"in":"query","name":"sportType","dataType":"string"},
        };
        app.get('/course-registrations',
            ...(fetchMiddlewares<RequestHandler>(CourseRegistrationController)),
            ...(fetchMiddlewares<RequestHandler>(CourseRegistrationController.prototype.getCourseRegistrations)),

            async function CourseRegistrationController_getCourseRegistrations(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCourseRegistrationController_getCourseRegistrations, request, response });

                const controller = new CourseRegistrationController();

              await templateService.apiHandler({
                methodName: 'getCourseRegistrations',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCourseRegistrationController_getCourseRegistrationById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/course-registrations/:id',
            ...(fetchMiddlewares<RequestHandler>(CourseRegistrationController)),
            ...(fetchMiddlewares<RequestHandler>(CourseRegistrationController.prototype.getCourseRegistrationById)),

            async function CourseRegistrationController_getCourseRegistrationById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCourseRegistrationController_getCourseRegistrationById, request, response });

                const controller = new CourseRegistrationController();

              await templateService.apiHandler({
                methodName: 'getCourseRegistrationById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCourseRegistrationController_updateCourseRegistration: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                registrationData: {"in":"body","name":"registrationData","required":true,"ref":"Partial_CourseRegisterFormFields_"},
        };
        app.put('/course-registrations/:id',
            ...(fetchMiddlewares<RequestHandler>(CourseRegistrationController)),
            ...(fetchMiddlewares<RequestHandler>(CourseRegistrationController.prototype.updateCourseRegistration)),

            async function CourseRegistrationController_updateCourseRegistration(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCourseRegistrationController_updateCourseRegistration, request, response });

                const controller = new CourseRegistrationController();

              await templateService.apiHandler({
                methodName: 'updateCourseRegistration',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCourseRegistrationController_deleteCourseRegistration: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/course-registrations/:id',
            ...(fetchMiddlewares<RequestHandler>(CourseRegistrationController)),
            ...(fetchMiddlewares<RequestHandler>(CourseRegistrationController.prototype.deleteCourseRegistration)),

            async function CourseRegistrationController_deleteCourseRegistration(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCourseRegistrationController_deleteCourseRegistration, request, response });

                const controller = new CourseRegistrationController();

              await templateService.apiHandler({
                methodName: 'deleteCourseRegistration',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoardingsController_getBoardings: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":100,"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/boardings',
            ...(fetchMiddlewares<RequestHandler>(BoardingsController)),
            ...(fetchMiddlewares<RequestHandler>(BoardingsController.prototype.getBoardings)),

            async function BoardingsController_getBoardings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoardingsController_getBoardings, request, response });

                const controller = new BoardingsController();

              await templateService.apiHandler({
                methodName: 'getBoardings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoardingsController_getBoarding: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/boardings/:id',
            ...(fetchMiddlewares<RequestHandler>(BoardingsController)),
            ...(fetchMiddlewares<RequestHandler>(BoardingsController.prototype.getBoarding)),

            async function BoardingsController_getBoarding(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoardingsController_getBoarding, request, response });

                const controller = new BoardingsController();

              await templateService.apiHandler({
                methodName: 'getBoarding',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoardingsController_createBoarding: Record<string, TsoaRoute.ParameterSchema> = {
                params: {"in":"body","name":"params","required":true,"ref":"BoardingCreationParams"},
        };
        app.post('/boardings',
            ...(fetchMiddlewares<RequestHandler>(BoardingsController)),
            ...(fetchMiddlewares<RequestHandler>(BoardingsController.prototype.createBoarding)),

            async function BoardingsController_createBoarding(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoardingsController_createBoarding, request, response });

                const controller = new BoardingsController();

              await templateService.apiHandler({
                methodName: 'createBoarding',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoardingsController_updateBoarding: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                params: {"in":"body","name":"params","required":true,"ref":"BoardingCreationParams"},
        };
        app.put('/boardings/:id',
            ...(fetchMiddlewares<RequestHandler>(BoardingsController)),
            ...(fetchMiddlewares<RequestHandler>(BoardingsController.prototype.updateBoarding)),

            async function BoardingsController_updateBoarding(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoardingsController_updateBoarding, request, response });

                const controller = new BoardingsController();

              await templateService.apiHandler({
                methodName: 'updateBoarding',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBoardingsController_deleteBoarding: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/boardings/:id',
            ...(fetchMiddlewares<RequestHandler>(BoardingsController)),
            ...(fetchMiddlewares<RequestHandler>(BoardingsController.prototype.deleteBoarding)),

            async function BoardingsController_deleteBoarding(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBoardingsController_deleteBoarding, request, response });

                const controller = new BoardingsController();

              await templateService.apiHandler({
                methodName: 'deleteBoarding',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
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
