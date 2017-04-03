import { createRouter } from '@expo/ex-navigation'

import home from './routes/home';

export default createRouter(
  () => ({
    home: () => home
  })
)
