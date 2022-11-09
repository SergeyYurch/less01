import request from 'supertest';
import {app} from "../src";
import {CreateVideoInputModel} from "../src/models/CreateVideoInputModel";

const testNewVideo1: CreateVideoInputModel = {
    title: 'title1',
    author: 'author1',
    availableResolutions: ['P240']
};

describe('testing /videos', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data');
    });

    it('Should return code 204 for /testing/all-data', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204);
    });

    it('Should return code 200 & empty array from db', async () => {
        await request(app)
            .get('/videos')
            .expect(200, []);
    });


    it('should not create new video with incorrect input data', async () => {
        //no title
        const resNoTitle = await request(app)
            .post('/videos')
            .send({
                    author: 'author1',
                    availableResolutions: ['240']
                }
            )
            .expect(400);

        expect(resNoTitle.body.errorsMessages[0]).toEqual({
            message: expect.any(String),
            field: 'title'
        });


        //no author
        const resNoAuthor = await request(app)
            .post('/videos')
            .send({
                    title: 'title1',
                    availableResolutions: ['240']
                }
            )
            .expect(400);

        expect(resNoAuthor.body.errorsMessages[0]).toEqual({
            message: expect.any(String),
            field: 'author'
        });


        // incorrect availableResolutions
        const resWrongResolution = await request(app)
            .post('/videos')
            .send({
                    title: 'title1',
                    author: 'author1',
                    availableResolutions: ['12']
                }
            )
            .expect(400);

        expect(resWrongResolution.body.errorsMessages[0]).toEqual({
            message: expect.any(String),
            field: 'availableResolutions'
        });


    });

    let id1: number = 0;
    let id2: number = 0;

    it('should create new video with correct input data', async () => {
        //create firs video
        const resVideo1 = await request(app)
            .post('/videos')
            .send({
                    title: 'title1',
                    author: 'author1',
                    availableResolutions: ['P240']
                }
            )
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
        const resVideo2 = await request(app)
            .post('/videos')
            .send({
                    title: 'title2',
                    author: 'author2',
                    availableResolutions: ['P240', 'P360']
                }
            )
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
    });

    it('should get video by id', async () => {
        const resVideoById = await request(app)
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
    });

    it('should update video by id', async () => {
        const resEditVideo = await request(app)
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
    });

    it('should  return 404 by wrong id', async () => {
        const resEditVideo = await request(app)
            .delete(`/videos/111`)
            .expect(404);
    });

    it('should delete video by id', async () => {
        const resEditVideo = await request(app)
            .delete(`/videos/${id1}`)
            .expect(204);
    });
});