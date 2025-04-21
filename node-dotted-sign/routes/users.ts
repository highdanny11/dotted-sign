import express from 'express'
import getLogger from 'utils/logger'
import { registerMiddlerware } from '../middlewares/users'

const router = express.Router()
import { regsiter, info } from '../controllers/users'

router.post('/signup', registerMiddlerware, regsiter)
router.post('/info', info)

export default router