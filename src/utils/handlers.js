export const responseJsonHandler = (success, reason, data) => ({
    success,
    reason,
    ...(data && Array.isArray(data) && { data }),
});

export const errorHandler = (status = 500, errorMessage = '') => {
    const error = new Error(errorMessage);
    error.status = status;
    return error;
};
