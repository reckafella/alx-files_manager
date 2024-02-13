import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';

const routes = (app) => {
  app.get('/', AppController.getHome);
  app.get('/status', AppController.getStatus);
  app.get('/stats', AppController.getStats);

  // post requests
  app.post('/users', UsersController.postNew);

  // Authenticate users
  app.get('/connect', AuthController.getConnect);
  app.get('/disconnect', AuthController.getDisconnect);
  app.get('/users/me', UsersController.getMe);
};

export default routes;
module.exports = routes;
