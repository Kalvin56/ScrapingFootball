const { News } = require("../Model/News");
const { httpHF } = require("../axios");
const { s3 } = require("../s3");
const { generateUniqueKey } = require("../utils");

const create = async (req, res) => 
{
	const { url, text } = req.body;
  try {
    // Vérifiez si l'URL existe déjà dans la base de données
    const existingNews = await News.findOne({ url });

    if (existingNews) {
      return res.status(400).json({ error: 'L\'URL existe déjà dans la base de données.' });
    }

		if(text){
			let bodySD = JSON.stringify({inputs: text});
			console.log(bodySD);

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
				newBody = {...req.body, s3key: key}

				// ajout de la news en bdd
				News.findOneAndUpdate({url: url},newBody, {
					new: true,
					upsert: true
				})
					.then((result) => {
						// sauvegarde de l'image dans un bucket aws s3
						s3.putObject(params, (err, data) => {
							if (err) {
								res.status(400).json({
									message: "Erreur lors du stockage de l'image dans S3",
								})
							} else {
								console.log('L\'image a été stockée avec succès dans S3');
								return res.status(201).json(result)
							}
						});
					})
					.catch((error) => res.status(400).json(
					{
						message: error?.message || "Une erreur est survenue",
					}))
			}).catch((error) => {
				console.log(error);
				return res.status(400).json({
					message: error?.message || "Une erreur est survenue",
				})
			})
		}
	} catch (error) {
    res.status(500).json({ error: 'Une erreur s\'est produite lors de la création de l\'actualité.' });
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
		.then(async (result) => {
			let newResult = []
			for (let index = 0; index < result.length; index++) {
				const element = result[index];
				if(element.s3key){
					const params = {
						Bucket: 'scrapbucket',
						Key: element.s3key
					};
					// récupération des images
					await s3.getObject(params).promise().then(
						(data) => {
							newResult.push(
								{
									...element._doc,
									image: data.Body.toString('base64')
								}
							)
						}
					).catch(
						(error) => {
							newResult.push(
								{
									...element._doc,
									image: null
								}
							)
						}
					)
				}else{
					newResult.push(
						{
							...element._doc,
							image: null
						}
					);
				}
				
			}
			res.status(200).json(newResult)
		})
		.catch((error) => res.status(400).json({
			message: error?.message || "Une erreur est survenue"
		}))
}

module.exports = {
	create,
	getId,
	getAll,
}