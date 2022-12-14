import {Router, Request, Response, NextFunction} from "express";
import {VideoModel} from "../models/VideoModel";
import {clearDb} from "./dataRepository";

export const testingRouter = Router();

testingRouter.use((req: Request, res: Response, next: NextFunction) => {
    next();
});

testingRouter.delete('/all-data', (req: Request, res: Response<VideoModel[]>): void => {
        const result: boolean = clearDb();
        if (result) {
            res.sendStatus(204);
        } else {
            res.sendStatus(500);
        }
    }
);
