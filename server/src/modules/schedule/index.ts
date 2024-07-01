import { router } from '@server/trpc'
import create from './create'
import find from './find'
import get from './get'
import remove from './remove'
import edit from './edit'

export default router({
  create,
  find,
  get,
  remove,
  edit,
})
