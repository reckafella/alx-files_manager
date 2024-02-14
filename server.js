import express from 'express';
import routes from './routes';

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

routes(app);

app.listen(port, () => {
  console.log(`Server listening on port http://localhost/${port}`);
});
