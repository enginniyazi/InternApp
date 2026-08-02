export declare class StorageService {
    private readonly uploadDir;
    constructor();
    saveCv(file: Express.Multer.File): Promise<string>;
}
