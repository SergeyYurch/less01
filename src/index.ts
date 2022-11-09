import express, {Request, Response} from 'express';
import {videoRouter} from "./routers/videoRouter";
import {testingRouter} from "./routers/testingRouter";

export const app = express();
const port = process.env.PORT || 3000 ;

app.use(express.json())

app.use('/videos', videoRouter)
app.use('/testing', testingRouter)

const db = {
    videos:[]
};
app.get('/videos',(req: Request, res: Response)=>{
    res.sendStatus(204)
})

app.get('/testing', (req: Request, res: Response) => {
    res.send(['1']);
});


app.delete('/testing/all-data', (req: Request, res: Response)=> {
    db.videos = []
    res.sendStatus(204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});