import {VideoModel} from "../models/VideoModel";
import {CreateVideoInputModel} from "../models/CreateVideoInputModel";
import {UpdateVideoInputModel} from "../models/UpdateVideoInputModel";

export interface dbInterface {
    videos: VideoModel[];
}

const db: dbInterface = {
    videos: []
};

export const getAllVideos = (): VideoModel[] => {
    console.log(db);
    return db.videos;
};

export const clearDb = (): boolean => {
    db.videos = [];
    return db.videos.length === 0;
};

export const createVideo = (data: CreateVideoInputModel): VideoModel => {
    const id: number = Date.now() * Math.round(Math.random() * 10);
    const {title, author, availableResolutions} = data;
    const createdAt = new Date().toISOString();
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const publicationDate = date.toISOString();
    const video: VideoModel = {
        id,
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt,
        publicationDate,
        availableResolutions
    };
    db.videos.push(video);
    return video;
};

export const editVideo = (id: number, data: UpdateVideoInputModel): boolean => {
    if (!findById(id)) return false;
    db.videos = db.videos.map(v => v.id !== id ? v : {
            id,
            title: data.title,
            author:data.author,
            canBeDownloaded:('canBeDownloaded' in data) ?  data.canBeDownloaded : v.canBeDownloaded,
            minAgeRestriction:('minAgeRestriction' in data) ?  data.minAgeRestriction : v.minAgeRestriction,
            createdAt: v.createdAt,
            publicationDate:('publicationDate' in data) ?  data.publicationDate : v.publicationDate,
            availableResolutions:('availableResolutions' in data) ?  data.availableResolutions : v.availableResolutions
        }
    );
    return true;
};

export const findById = (id: number): VideoModel | undefined => {
    return db.videos.find(el => el.id === id);
};

export const deleteById = (id: number): boolean => {
    if (!findById(id)) return false;
    db.videos = db.videos.filter(v => v.id !== id);
    return true;
};

