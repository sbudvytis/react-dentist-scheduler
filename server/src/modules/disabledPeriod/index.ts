import { router } from '@server/trpc'
import create from './create'
import find from './find'
import remove from './remove'

export default router({
  create,
  find,
  remove,
})
