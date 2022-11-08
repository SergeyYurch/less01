export type CreateVideoInputModel = {
    title: string;
    author: string;
    availableResolutions: string[]
}

export enum Resolutions {
    'P144',
    'P240',
    'P360',
    'P480',
    'P720',
    'P1080',
    'P1440',
    'P2160'
}

const ResolutionsArray = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
