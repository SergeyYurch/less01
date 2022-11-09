"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../src");
const testNewVideo1 = {
    title: 'title1',
    author: 'author1',
    availableResolutions: ['P240']
};
describe('testing /videos', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app).delete('/testing/all-data');
    }));
    it('Should return code 204 for /testing/all-data', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .delete('/testing/all-data')
            .expect(204);
    }));
    it('Should return code 200 & empty array from db', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(src_1.app)
            .get('/videos')
            .expect(200, []);
    }));
    it('should not create new video with incorrect input data', () => __awaiter(void 0, void 0, void 0, function* () {
        //no title
        const resNoTitle = yield (0, supertest_1.default)(src_1.app)
            .post('/videos')
            .send({
            author: 'author1',
            availableResolutions: ['240']
        })
            .expect(400);
        expect(resNoTitle.body.errorsMessages[0]).toEqual({
            message: expect.any(String),
            field: 'title'
        });
        //no author
        const resNoAuthor = yield (0, supertest_1.default)(src_1.app)
            .post('/videos')
            .send({
            title: 'title1',
            availableResolutions: ['240']
        })
            .expect(400);
        expect(resNoAuthor.body.errorsMessages[0]).toEqual({
            message: expect.any(String),
            field: 'author'
        });
        // incorrect availableResolutions
        const resWrongResolution = yield (0, supertest_1.default)(src_1.app)
            .post('/videos')
            .send({
            title: 'title1',
            author: 'author1',
            availableResolutions: ['12']
        })
            .expect(400);
        expect(resWrongResolution.body.errorsMessages[0]).toEqual({
            message: expect.any(String),
            field: 'availableResolutions'
        });
    }));
    let id1 = 0;
    let id2 = 0;
    it('should create new video with correct input data', () => __awaiter(void 0, void 0, void 0, function* () {
        //create firs video
        const resVideo1 = yield (0, supertest_1.default)(src_1.app)
            .post('/videos')
            .send({
            title: 'title1',
            author: 'author1',
            availableResolutions: ['P240']
        })
            .expect(201);
        id1 = resVideo1.body.id;
        expect(resVideo1.body).toEqual({
            id: expect.any(Number),
            title: 'title1',
            author: 'author1',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ['P240']
        });
        //create second video
        const resVideo2 = yield (0, supertest_1.default)(src_1.app)
            .post('/videos')
            .send({
            title: 'title2',
            author: 'author2',
            availableResolutions: ['P240', 'P360']
        })
            .expect(201);
        id2 = resVideo2.body.id;
        expect(resVideo2.body).toEqual({
            id: expect.any(Number),
            title: 'title2',
            author: 'author2',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ['P240', 'P360']
        });
    }));
    it('should get video by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const resVideoById = yield (0, supertest_1.default)(src_1.app)
            .get(`/videos/${id2}`)
            .expect(200);
        expect(resVideoById.body).toEqual({
            id: id2,
            title: 'title2',
            author: 'author2',
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: expect.any(String),
            publicationDate: expect.any(String),
            availableResolutions: ['P240', 'P360']
        });
    }));
    it('should update video by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const resEditVideo = yield (0, supertest_1.default)(src_1.app)
            .put(`/videos/${id1}`)
            .send({
            title: 'title-edit',
            author: 'author-edit',
            canBeDownloaded: true,
            minAgeRestriction: 5,
            publicationDate: '01.01.2024',
            availableResolutions: null
        })
            .expect(204);
    }));
});
