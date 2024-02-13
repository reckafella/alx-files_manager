import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const routes = (app) => {
  app.get('/', AppController.getHome);
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);

  // post requests
  app.post('/users', UsersController.postNew);
};

export default routes;
module.exports = routes;
