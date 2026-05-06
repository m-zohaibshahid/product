export function SuccessResponse(message: string, data: any = null, statusCode: number = 200) {
    return {
        success: true,
        statusCode,
        message,
        data,
    };
}


export function ErrorResponse(message: string, error: any = null, statusCode: number = 400) {
    return {
        success: false,
        statusCode,
        message,
        error: error || null,
    };
}