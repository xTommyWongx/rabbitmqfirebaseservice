import * as Routers from '../routes';
import { responseJsonHandler } from '../utils/handlers';
import { errorMiddleware } from '../middlewares/errorMiddleware';

export default (app) => {
    // define router
    app.use('/notification', new Routers.NotificationRouter().router());

    // if there is no routing get hit, 
    // this middleware will reture errro response
    app.use((req, res, next) => {
        res.status(404).json(responseJsonHandler(false, 'fail'));
    });
    
    // error middleware handler
    app.use(errorMiddleware);
};
