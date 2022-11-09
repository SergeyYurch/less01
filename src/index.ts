import express, {Request, Response} from 'express';
import {videoRouter} from "./routers/videoRouter";
import {testingRouter} from "./routers/testingRouter";

export const app = express();
const port = process.env.PORT || 3000 ;

app.use(express.json())

app.use('/videos', videoRouter)
app.use('/testing', testingRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});