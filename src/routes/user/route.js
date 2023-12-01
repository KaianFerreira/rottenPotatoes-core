import express from 'express'
import Joi from 'joi'
import { create, validate } from './model'

const router = express.Router()

router.post('/', async (req, res) => {
	try {
		console.log('post /user')
		const schema = Joi.object().options({ abortEarly: false}).keys({
			email: Joi.string().email().required(),
			userName: Joi.string().required(),
			password: Joi.string().regex(/^[a-zA-Z0-9]{6,20}$/).required(),
			name: Joi.string().required(),
			gender: Joi.string().required(),
			age: Joi.number().integer().positive().min(18),
		})

		const { value, error } = schema.validate(req.body)
		if (error) {
			console.log(error)
		}

		const {
			email,
			userName,
			password,
			name,
			gender,
			age
		} = value
		const user = await create(
			email,
			userName,
			password,
			name,
			gender,
			age
		)
		return res.status(201).send(user)
	} catch (error) {
		console.log(error)
		return res.status(400).send({ error: 'internal error' })
	}
})

router.post('/signin', async (req, res) => {
	try {
		console.log('get /signin')

		const schema = Joi.object().options({ abortEarly: false }).keys({
			userName: Joi.string().required(),
			password: Joi.string().regex(/^[a-zA-Z0-9]{6,20}$/).required(),
		})

		const { value, error } = schema.validate(req.body)

		if (error) return res.status(400).send ({ error: 'invalidLogin or password', fields: [...error.details.map(field => field.path[0])]})

		const valid = await validate(value.userName, value.password)
		console.log(valid.toJSON())

		if (!valid) res.status(404).send('not found')
		else res.status(200).send(valid.toJSON())
		return 

	} catch (error) {
		console.log(error)
	}
})

export default router