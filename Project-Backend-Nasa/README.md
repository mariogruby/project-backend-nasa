# project-backend-nasa
Segundo proyecto de IronHack de Backend
## About
Participantes: 
- Gerard Bove
- Mario Ruby
- Ivan De Gea
- Raul Fabra. 

Somos desarrolladores Web juniors FullStack y este proyecto trata de un foro interactivo de noticias de la NASA 

## Despliegue
Puedes ver el proyecto [aqui](https://github.com/)

## Estructura de trabajo 
Hemos hecho un grupo de tarbajo utilizando la plataforma [Trello](https://trello.com/b/H9d5CtPO/foro-backend-nasa)

## Guia de instalacion 
- Fork this repo
- Clone this repo 

```shell
$ cd project-backend-nasa
$ npm install
$ npm start
```

## Modelo
#### User.model.js
```js
const userSchema = new Schema({
  username: { type: String, required: true, unique: true},
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  passwordRepeat: { type: String, required: true},
  comment: [{ type: Schema.Types.ObjectId, ref: "comment" }],
  isAdmin: Boolean,
});
```
#### Comment.model.js
```js
const commentSchema = new Schema({
    user:[{ type: Schema.Types.ObjectId, ref: "user" }],
    date: { type: Date, default:Date.now, required: true},
    comment:{type: String, required: true}
})
```
#### Noticias.model.js
```js
const noticiasSchema = new Schema({
    title: { type: String, required: true}
    date: { type: Date, default:Date.now, required: true}
    explanation: { type: String, required: true}
    imageURL: { type: String}
})
```   
## Roles de Usuario

| Role  | Capacidades                                                                                                                              | Propiedad    |
| :---: | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| User  |Puede iniciar sesión/cerrar sesión. Puede leer todas las noticias. Puede crear un comentario.                                                                     | isAdmin: false |
| Admin | Puede iniciar sesión/cerrar sesión. Puede leer, editar o eliminar todas las noticias. Puede crear una nueva noticia. Puede modificar las noticias y comentarios de los usuarios  | isAdmin: true  |

## Routes
## Routes
| Method | Endpoint                    | Require                                             | Response (200)                                                        | Action                                                                    |
| :----: | --------------------------- | --------------------------------------------------- |---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| POST   | /signup                     | const { username, email, password } = req.body      | request({user: user})                                                    | Registra al usuario en la base de datos y devuelve el usuario conectado.      |
| POST   | /login                      | const { email, password } = req.body                | request({authToken: authToken})                                          | Logs in a user already registered.                                        |
| GET    | /home            | -                                                   | res.render('home')                                                 | te lleva a la pagina principal con las ultimas noticias
| GET    | /news            | -                                                   | res.render('news')                                                  | Te lleva a la pagina de las noticias relacionadas de la nasa extraidas de la API |
| GET    | /news/:newsId | const { newId } = req.params                    |   res.render('newsId')                                                   | Te lleva a la noticia especifica                       |
| GET    | /profile | const { user }                  | res.render('perfil')                                                       | te lleva a tu perfil de usuario
---

