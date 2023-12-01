import {
	connect as connectPg,
} from '../../config/db'
import { DataTypes } from 'sequelize'

const sequelize = connectPg()

export const Movie = sequelize.define('movie', {
	name: DataTypes.STRING,
	imagem: DataTypes.STRING,
	synopsis: DataTypes.STRING
})


export const getAll = async () => {
	const movies = await Movie.findAll()

	return movies
}

export const getById = async(id) => {
	const movie = await Movie.findOne({ where: { id } })

	return movie
}

export const create = async (
	name,
	imagem,
	synopsis
) => {
	const movie = await Movie.create({
		name,
		imagem,
		synopsis
	})

	await movie.save()
	return movie
}

export const update = async(
	id,
	name,
	imagem,
	synopsis
) => {
	const movie = await Movie.update({ name, imagem, synopsis}, { where: { id } })
	return movie
}

export const remove = async (id) => {
	const movieRemoved = await Movie.destroy({ where: { id }})
	return movieRemoved
}