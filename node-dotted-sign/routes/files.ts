import express from 'express'
import { createFiles } from 'controllers/files'
const router = express.Router()

router.post('/create', createFiles)

export default router