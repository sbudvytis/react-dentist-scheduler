import { router } from '@server/trpc'
import create from './create'
import find from './find'
import edit from './edit'
import remove from './remove'
import get from './get'

export default router({
  create,
  find,
  edit,
  remove,
  get,
})
