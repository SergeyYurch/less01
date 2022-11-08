export type UpdateVideoInputModel = {
    title:string;
    author:string;
    availableResolutions:string[];
    canBeDownloaded:boolean;
    minAgeRestriction: number;
    publicationDate: string
}