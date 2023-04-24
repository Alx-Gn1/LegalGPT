
# Legal GPT

**Vidéo de présentation** : https://www.youtube.com/watch?v=Mrd5dw8m3hc  
  
Un Chatbot IA spécialisé dans le code du travail en france, peut également répondre aux questions sur le code pénal.  
Legal GPT peut répondre à vos questions que vous soyez employé, employeur, freelance, sans emploi, ou tout autre situation.  
  
L'application utilise l'api de chatGPT ainsi qu'un prompt pour mettre l'IA dans le bon contexte.

L'application a été réalisée sous **NextJS 13**, en **Typescript**. La base de donnée est gérée avec **MySQL**

## Installation

Il faut avoir Node.JS installé sur son pc : https://nodejs.org/en/download  
Installer également MySQL Server sur son pc : https://dev.mysql.com/downloads/  
  
1/ Ouvrir le fichier `schema.sql` et définir un mot de passe pour l'utilisateur (ligne 18)  
Exécutez les commandes SQL présentes dans le fichier  
2/ Ouvrir le fichier `next.config.js` définir les variables d'environnement suivantes :  
- `OPENAI_API_KEY` https://platform.openai.com/account/api-keys
- `MYSQL_PASSWORD` Le mot de passe que vous avez définit précédemment dans schema.sql
- Vous êtes libres de modifier le token privé JsonWebToken  
  
    
  
3/ Une fois l'application configurée il suffit d'exécuter les commandes :
```
npm run build 
npm start
```

## Utilisation

Une fois l'application lancée, ouvrez l'adresse http://localhost:3000/ dans votre navigateur.  
Créez vous un compte (la photo de profil est optionelle), vous serez redirigé vers une page pour finaliser la configuration du compte.  
Vous êtes prêts à utiliser l'app !
