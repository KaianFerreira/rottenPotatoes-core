import { connect as connectPg } from '../config/db'
import { DataTypes } from 'sequelize'

export default async function () {
	const sequelize = await connectPg({ start: true })
	sequelize.define('movie', {
		name: DataTypes.STRING,
		imagem: DataTypes.STRING,
		synopsis: DataTypes.STRING
	})
}
