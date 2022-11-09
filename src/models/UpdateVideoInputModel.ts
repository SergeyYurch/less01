export type UpdateVideoInputModel = {
    title:string;
    author:string;
    availableResolutions?:string[] | null;
    canBeDownloaded?:boolean;
    minAgeRestriction?: number | null;
    publicationDate?: string
}