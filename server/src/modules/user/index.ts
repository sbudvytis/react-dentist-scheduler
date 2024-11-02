import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import approve from './approve'
import find from './find'
import remove from './remove'
import add from './add'
import verify from './verify'
import request from './request'

export default router({
  login,
  signup,
  add,
  approve,
  find,
  remove,
  verify,
  request,
})
