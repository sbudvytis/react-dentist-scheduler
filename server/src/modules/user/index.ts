import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import approve from './approve'
import find from './find'
import remove from './remove'

export default router({
  login,
  signup,
  approve,
  find,
  remove,
})
