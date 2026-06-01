import { app } from './app';
import { env } from './config/env';
import './config/redis';

app.listen(Number(env.PORT), () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
