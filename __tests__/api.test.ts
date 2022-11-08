import request from 'supertest'
import {app} from "../src";



describe('should return statusCode 204 for delete:/testing/all-data', () => {
    beforeAll(async () =>{
        await request(app).delete('/testing/all-data')
    })

    it('test message', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    });
});