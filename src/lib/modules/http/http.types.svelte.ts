export interface ErrorResponse {
    type: string | null;
    title: string;
    status: number;
    errors: {
        [fieldName: string]: string[];
    } | null;
    traceId: string | null;
}

export interface CheckEmailUsernameAvailabilityResponse {
    isEmailAvailable: boolean | null;
    isUsernameAvailable: boolean | null;
}
