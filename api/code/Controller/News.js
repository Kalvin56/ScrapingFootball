const { News } = require("../Model/News");

const create = (req, res) => {
	News.create(req.body)
		.then((result) => res.status(201).json(result))
		.catch((error) => res.status(400).json({
			message: error?.message || "Une erreur est survenue",
		}))
}

const getId = (req, res) => {
	let id = req.params.id;
	News.findOne({ _id: id })
		.then((result) => res.status(200).json(result))
		.catch((error) => res.status(404).json({
			message: `la news ${id} n'a pas été trouvée`
		}))
}

const getAll = (req, res) => {
	News.find({})
		.then((result) => res.status(200).json(result))
		.catch((error) => res.status(400).json({
			message: error?.message || "Une erreur est survenue"
		}))
}

module.exports = {
	create,
	getId,
	getAll,
}