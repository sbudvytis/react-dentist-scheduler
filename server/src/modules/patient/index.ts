import { router } from '@server/trpc'
import create from './create'
import find from './find'
import get from './get'
import edit from './edit'

export default router({
  create,
  find,
  get,
  edit,
})
