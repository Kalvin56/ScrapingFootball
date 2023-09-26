const { News } = require("../Model/News");
const { httpHF } = require("../axios");
const { s3 } = require("../s3");
const { generateUniqueKey } = require("../utils");

const create = (req, res) => {
	let creationurl = req.body.url;
	if(req.body?.text){
		let bodySD = JSON.stringify({inputs: req.body.text});
		// génération image model stable diffusion
		httpHF.post('/models/runwayml/stable-diffusion-v1-5', bodySD, {responseType: 'arraybuffer'})
		.then((response) => {
			const buffer = Buffer.from(response.data);
			key = `${generateUniqueKey()}.jpg`
			const params = {
				Bucket: 'scrapbucket',
				Key: key,
				Body: buffer,
			};
			// sauvegarde de l'image dans un bucket aws s3
			s3.putObject(params, (err, data) => {
				if (err) {
					res.status(400).json({
						message: "Erreur lors du stockage de l'image dans S3",
					})
				} else {
					console.log('L\'image a été stockée avec succès dans S3');
					newBody = {...req.body, s3key: key}
					// ajout de la news en bdd
					News.findOneAndUpdate({url: creationurl},newBody, {
						new: true,
						upsert: true
					})
						.then((result) => res.status(201).json(result))
						.catch((error) => res.status(400).json({
							message: error?.message || "Une erreur est survenue",
						}))
				}
			});
		}).catch((error) => res.status(400).json({
			message: error?.message || "Une erreur est survenue",
		}))
	}
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