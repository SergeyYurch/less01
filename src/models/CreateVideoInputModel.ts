export type CreateVideoInputModel = {
    title: string;
    author: string;
    availableResolutions?: string[] | null
}

export const resolutionsArray = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'];
