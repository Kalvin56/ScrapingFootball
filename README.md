# Technologies
Nodejs, electron, c#, AWS, HuggingFace, MongoDB

# Description
Récupération des derniers articles de football sur les sites l'équipe et one football  
Utilisation du scraping pour la récupération des données  
Utilisation d'un model d'IA de HuggingFace pour faire un résumé de l'article  
Utilisation d'un model d'IA de HuggingFace pour faire une image depuis le résumé  
Listage des articles au travers d'un logiciel  

# Installation
A la racine : Créer un .env à partir du template  
Dans le dossier front : Créer un .env à partir du template  
Dans le dossier api/code, créer un .env à partir du template  
Dans le dossier docker-entrypoint-initdb.d, créer le fichier mongo-init.js à partir du template  
Dans le dossier script/Scraping/bin/Debug/net6.0, créer le fichier .env à parir du template  
Lancer la commande `docker-compose up` depuis la racine

# Mise en place AWS (optionnel)
Créer un compte AWS  
Depuis AWS S3, créer un nouveau bucket, avec le nom 'scrapbucket'  
Depuis AWS IAM, onglet utilisateur, créer un nouvel utilisateur.  
Depuis AWS IAM, onglet politique, créer une nouvelle politique, choisir le format json et rentrer cette configuration:  
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Statement1",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::scrapbucket/*"
            ]
        }
    ]
}
```
Depuis AWS IAM, onglet utilisateur, cliquer sur notre utilisateur dernièrement crée, dans autorisations, ajouter comme nouvelle autorisation notre politique nouvellement créee.  