import {Router, Request, Response} from "express";
import {VideoModel} from "../models/VideoModel";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody
} from "../types/types";
import {createVideo, deleteById, editVideo, findById, getAllVideos} from "./dataRepository";
import {CreateVideoInputModel, resolutionsArray} from "../models/CreateVideoInputModel";
import {APIErrorResult} from "../models/APIErrorResult";
import {UpdateVideoInputModel} from "../models/UpdateVideoInputModel";

export const videoRouter = Router();
const error: APIErrorResult = {
    errorsMessages: []
};

const clearError = () => {
    error.errorsMessages = [];
};


const validateId = (queryId: string): number => {
    const id: number = Number(queryId);
    if (!id || id < 1 || !findById(id)) return 0;
    return id;
};

const validateTitle = (title: string | undefined | null): void => {
    if (!title) {
        error.errorsMessages.push({
            message: 'Title is require',
            field: 'title'
        });
    } else {
        if (title.length > 40) error.errorsMessages.push({
            message: 'Title max-length should be 40',
            field: 'title'
        });
    }
};

const validateAuthor = (author: string | undefined | null): void => {
    if (!author) {
        error.errorsMessages.push({
            message: 'Author is require',
            field: 'author'
        });
    } else {
        if (author.length > 20) error.errorsMessages.push({
            message: 'Author max-length should be 40',
            field: 'author'
        });
    }
};

const validateAvailableResolutions = (resolutions: string[]) => {

    if (resolutions.length === 0) {
        error.errorsMessages.push({
            message: 'Error: count of available resolutions should not be 0',
            field: 'availableResolutions'
        });
    } else {
        resolutions.forEach(el => {
            if (!resolutionsArray.includes(el)) error.errorsMessages.push({
                message: 'Error: availableResolutions incorrect',
                field: 'availableResolutions'
            });
        });
    }
};

const validateMinAgeRestriction = (age: number) => {
    if (age < 1 || age > 18) error.errorsMessages.push({
        message: 'Error: MinAgeRestriction incorrect',
        field: 'minAgeRestriction'
    });
};

const validatePublicationDate = (date: string) => {
    if (!Date.parse(date)) error.errorsMessages.push({
        message: 'Error: PublicationDate incorrect',
        field: 'publicationDate'
    });
};

const validateCanBeDownloaded = (arg:boolean | undefined) =>{
    if (typeof arg !== 'boolean') {
        error.errorsMessages.push({
            message: 'Error: canBeDownloaded should be true or false',
            field: 'canBeDownloaded'
        });
    }
}

videoRouter.get('/', (req: Request, res: Response<VideoModel[]>): void => {
    clearError();
    const dataFromDB = getAllVideos();
    const dataOutput: VideoModel[] = dataFromDB.map(v => ({
        id: v.id,
        title: v.title,
        author: v.author,
        canBeDownloaded: v.canBeDownloaded,
        minAgeRestriction: v.minAgeRestriction,
        createdAt: v.createdAt,
        publicationDate: v.publicationDate,
        availableResolutions: v.availableResolutions
    }));
    res.status(200).send(dataOutput);
});

videoRouter.post('/', (req: RequestWithBody<CreateVideoInputModel>, res: Response<VideoModel | APIErrorResult>) => {
    clearError();
    const {title, author} = req.body;
    validateTitle(title);
    validateAuthor(author);
    const availableResolutions: string[] | null | undefined = ('availableResolutions' in req.body) ? req.body.availableResolutions : undefined;
    if (availableResolutions) validateAvailableResolutions(availableResolutions);
    if (error.errorsMessages.length > 0) {
        res.status(400).send(error);
        return;
    }
    const result = createVideo({title, author, availableResolutions});
    res.status(201).json(result);
});

videoRouter.get(
    '/:id',
    (req: Request<{ id: string }>,
     res: Response<VideoModel | APIErrorResult>
    ): void => {
        clearError();
        const id: number = validateId(req.params.id);
        if (!id) {
            res.sendStatus(404);
            return;
        }
        res.status(200).json(findById(id));
    });

videoRouter.put(
    '/:id',
    (req: RequestWithParamsAndBody<{ id: string }, UpdateVideoInputModel>,
     res: Response<APIErrorResult>
    ): void => {
        clearError();
        const id = validateId(req.params.id);
        if (!id) {
            res.sendStatus(404);
            return;
        }
        const data = req.body;
        validateTitle(data.title);
        validateAuthor(data.author);
        const availableResolutions = ('availableResolutions' in req.body) ? req.body.availableResolutions : undefined;
        if (availableResolutions) validateAvailableResolutions(availableResolutions);
        if ('canBeDownloaded' in req.body) validateCanBeDownloaded( req.body.canBeDownloaded )
        const minAgeRestriction = ('minAgeRestriction' in req.body) ? req.body.minAgeRestriction : undefined;
        if (minAgeRestriction) validateMinAgeRestriction(minAgeRestriction);
        if (data.publicationDate) validatePublicationDate(data.publicationDate);
        if (error.errorsMessages.length > 0) {
            res.status(400).send(error);
            return;
        }
        editVideo(id, data) ? res.sendStatus(204) : res.sendStatus(500);
    });

videoRouter.delete('/:id', (req: RequestWithParams<{ id: string }>, res: Response): void => {
    clearError();
    const id = validateId(req.params.id);
    if (!id) {
        res.sendStatus(404);
        return;
    }
    deleteById(id) ? res.sendStatus(204) : res.sendStatus(404);
});
