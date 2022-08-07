import { responseJsonHandler } from '../utils/handlers';

export const errorMiddleware = (error, req, res, next) => {
    const { message = '', status = 500 } = error;
    return res
        .status(status)
        .json(responseJsonHandler(false, message));
};
