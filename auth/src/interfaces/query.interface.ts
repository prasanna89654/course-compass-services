export enum SortOrder {
    ASC = "asc",
    DESC = "desc",
}

export interface CommonQuery {
    skip?: number;
    take?: number;
    orderBy?: string;
    sortOrder?: SortOrder;
    search?: string;
}