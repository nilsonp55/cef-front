export class ErrorResponse {
    data: any;
    response: {
        code: string;
        description: string;
        source: string;
        errors: any;
    }
}