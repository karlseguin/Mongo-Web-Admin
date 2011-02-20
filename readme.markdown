# About #

Mongo Web Admin is a web-based administrative tool for [MongoDB](http://www.mongodb.org/).

The first phase of Mongo Web Admin is to provide a shell-like interface via the browser. This first phase is partially completed. User's familiar with the MongoDB shell will hopefully find the Web Admin familiar. Once connect to a Mongo Database, commands such as `show dbs;`, `db.getCollcetionNames();`, `db.users.find();`, `db.users.find({status: 1}, {username:1, email:1}).limit(10).skip(10).sort({username:1})`, `db.users.remove()` and so on should work.

Some commands are still missing, most noteworthy are `ensureIndex` and `mapReduce`.

The second phase is to provide UI widgets to help people manage MongoDB without knowing all the shell commands.

## Browsers ##

Mongo Web Admin works in Firefox and Chrome.

## Usage ##

Mongo Web Admin is written in Rails. Unless you can figure out how to run it yourself, Mongo Web Admin is not ready for you (but we are working on it). Out of the box Mongo Web Admin is pretty restrictive. Check out `config/config.sample.yml` for a few options that can be placed in `config/config.yml`.