import express from 'express'
import Joi from 'joi'
import { create, getAll, getById, update, remove } from './model'

const router = express.Router()
router.get('/', async (req, res) => {
	try {
		console.log('get /movie')

		const movies = await getAll()

		res.send(movies)
	} catch (error) {
		console.log(error)
		return res.status(400).send({ error: 'internal error' })
	}
})

router.get('/:id', async (req, res) => {
	console.log('GET /movie/:id')

	const schema = Joi.object().options({ abortEarly: true }).keys({
		id: Joi.number().integer().required()
	})

	const { value, error } = schema.validate(req.params)

	if (error) {
		console.log(error)
		return res.status(400).send(error)
	}

	const movie = await getById(value.id)

	return res.send(movie)
})

router.post('/', async (req, res) => {
	try {
		console.log('post /movie')
		const schema = Joi.object().options({ abortEarly: false}).keys({
			name: Joi.string().required(),
			imagem: Joi.string().required(),
			synopsis: Joi.string().required(),
			
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			console.log(error)
		}

		const {
			name,
			imagem,
			synopsis
		} = value
		const movie = await create(
			name,
			imagem,
			synopsis
		)
		return res.status(201).send(movie)
	} catch (error) {
		console.log(error)
		return res.status(400).send({ error: 'internal error' })
	}
})
router.put('/:id', async (req, res) => {
	try {
		console.log('put /movie/:id')
		const schema = Joi.object().options({ abortEarly: false}).keys({
			name: Joi.string().required(),
			imagem: Joi.string().required(),
			synopsis: Joi.string().required(),
		})

		const schemaParams = Joi.object().options({ abortEarly: false}).keys({
			id: Joi.number().integer().required()
		})
		const params = schemaParams.validate(req.params)
		
		const { value, error } = schema.validate(req.body)
		if (error || params.error) {
			console.log(error)
		}

		const {
			name,
			imagem,
			synopsis
		} = value
		const movie = await update(
			params.value.id,
			name,
			imagem,
			synopsis
		)
		return res.status(201).send({ moviesUpdated: movie })
	} catch (error) {
		console.log(error)
		return res.status(400).send({ error: 'internal error' })
	}
})
router.delete('/:id', async (req, res) => {
	console.log('delete /movie/:id')
	const schemaParams = Joi.object().options({ abortEarly: false}).keys({
		id: Joi.number().integer().required()
	})
	const params = schemaParams.validate(req.params)

	const removedMovie = await remove(params.value.id)

	return res.status(200).send({ removedMovie })
})

export default router