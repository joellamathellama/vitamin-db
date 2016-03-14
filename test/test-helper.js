process.env.NODE_ENV = 'test'

//Store the location of the server and client folders
global.__server = __dirname + '/../server'
global.__client = __dirname + '/../client'
global.__test = __dirname + '/../test'

//Dependencies
const db = require(__server + '/db')
const request = require('supertest-as-promised')

//Models and APIs
const User = require(__server + '/models/user')

//Make chai's 'expect' accessible from everywhere
var chai = require('chai')
global.expect = chai.expect
//Could instead make everything should-able:
  // chai.should()

//
//Helper Functions
//

TH = {}
module.exports = TH

//
//Exportable function setting up app for testing
//

var express = require('express')

TH.createApp = function(loader) {

	var app = express()
	app.use(require('body-parser').json())

	app.testReady = function() {
		//Log errors
		app.use(function(err, req, res, next) {
			console.error('==Error==')
			console.error(' ' + err.stack)
			next(err)
		})
	}

	return app

}

/*
  MODEL ATTRIBUTES
*/
TH.UserAttributes = function(username, password, email, phone) {
	this.username = username
	this.password = password
	this.email = email
	this.phone = phone
}

TH.DoctorAttributes = function(name, street_address, city, state_abbrev, zip, email, web, phone, type) {
	this.name = name
	this.street_address = street_address
	this.city = city
	this.state_abbrev = state_abbrev
	this.zip = zip
	this.email = email
	this.web = web
	this.phone = phone
	this.type = type
}

/*
  Generic Functions
*/

TH.hasRightKeys = function(obj, arrayOfKeys) {
	var k = Object.keys(obj)
	return arrayOfKeys.reduce( function(foundAll, current) {
		return foundAll && k.indexOf(current) > -1
	}, true)
}

//Returns a boolean indicating whether every property in sourceObj has been successfully added to dbObj
TH.propsMatch = function(dbObj, sourceObj) {
	return Object.keys(sourceObj).reduce( function(bool, current) {
		return bool && sourceObj[current] === dbObj[current]
	}, true)
}


/*
  User helper methods
*/

//Returns a boolean indicating whether user object has all properties that should be stored in the db
TH.isValidUser = function(user) {
	var props = ['id_user', 'username', 'password', 'email', 'phone', 'created_at', 'updated_at']
	return TH.hasRightKeys(user, props)
}

//Returns a boolean indicating whether user object has all properties we want to send to the client
TH.isValidPublicUser = function(user) {
	var props = ['id_user', 'username', 'email', 'phone']
	return TH.hasRightKeys(user, props)
}

//Returns a Promise obj that returns boolean indicating whether the db object has the correct values
TH.userPropsMatch = function(dbUser, sourceObj) {
	console.log('in db: ', dbUser, 'source', sourceObj)
	var nonPwPropsMatch = Object.keys(sourceObj).reduce( function(soFar, current) {
		console.log('comparing', dbUser[current],'against', sourceObj[current])
		return current === 'password' ? true : soFar && (dbUser[current] === sourceObj[current])
	}, true)
	console.log('non pw props match? ', nonPwPropsMatch)

	return User.passwordMatches(sourceObj.password, dbUser.password)
	  .then( function(result) {
	  	console.log('result of pwMatches', result)
	  	return result && nonPwPropsMatch
	  })
}

// Creates a User - returns the username
TH.createUserReturnUsername = function(attrs) {
	return User.createUser(attrs)
	  .then( function(user) {
	  	return user.username
	  })
}

//Creates a User - returns the full user object
TH.createUserReturnUser = function(attrs) {
	return User.createUser(attrs)
	  .then( function(user) {
	  	return User.findByUsername(user.username)
	  })
}

//Creates a User - returns the id
TH.createUserReturnId = function(attrs) {
	return TH.createUserReturnUser(attrs)
	  .then( function(user) {
	  	return user.id_user
	  })
}

//Creates a user without encrypting the password - returns the username
TH.createUserNoEncryptReturnUsername = function(attrs) {
	return User.create(attrs)
	  .then( function(user) {
	  	return user.username
	  })
}

//Creates a user without encrypting the password - returns the full user object
TH.createUserNoEncryptReturnUser = function(attrs) {
	return User.create(attrs)
	  .then( function(user) {
	  	return User.findByUsername(user.username)
	  })
}

//Creates a User without encrypting the password - returns the id
TH.createUserNoEncryptReturnId = function(attrs) {
	return TH.createUserNoEncryptReturnUser(attrs)
	  .then( function(user) {
	  	return user.id_user
	  })
}





