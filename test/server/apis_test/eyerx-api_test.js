const db = require(__server + '/db')
const request = require('supertest-as-promised')
const routes = require(__server + '/index')

const TH = require(__test + '/test-helper')

const Auth = require(__server + '/models/auth')
const User = require(__server + '/models/user')
const EyeRx = require(__server + '/models/eyerx')

xdescribe('/eyerx-api', function() {

	//set up app
	var app = TH.createApp()
	app.use('/', routes)
	app.testReady()

	describe('GET /eyerx', function() {

		before(function() {
			return db.deleteEverything()
		})

		var newUser1 = new TH.UserAttributes('imauser', 'password', 'something@gmail.com', '453-245-2423')
		var user1_id = undefined
		var newEyeRx1 = undefined
		var newEyeRx2 = undefined

		it('returns the current prescription', function() {

			return TH.createUserReturnId(newUser1)
			  .then(function(id) {
			  	user1_id = id
			  	newEyeRx1 = new TH.EyeRxAttributes(user1_id, 2.25, 2.00, 2.00, -1.25, 20, 48, 2, 2)
			  	return EyeRx.createEyeRx(newEyeRx1)
			  })
			  .then(function() {
			  	newEyeRx2 = new TH.EyeRxAttributes(user1_id, 2.25, 2.00, 2.00, -1.25, 20, 48, 2, 2)
			  	return EyeRx.createEyeRx(newEyeRx2)
			  })
			  .then(function() {
			  	return Auth.createToken(newUser1.username)
			  })
			  .then(function(token) {
			  	return request(app)
			  	  .get('/eyerx')
			  	  .set('x-access-token', token)
			  	  .expect(200)
			  	  .then(function(result) {
			  	  	var got = JSON.parse(result.text)
			  	  	expect(got).to.be.an('object')
			  	  	expect(got.eyerx).to.be.an('object')
			  	  	expect(got.eyerx.current).to.be.true
			  	  	expect(TH.isValidPublicEyerx(got.eyerx)).to.be.true
			  	  	expect(TH.propsMatchExceptMaybeCurrent(got.eyerx, newEyeRx2)).to.be.true
			  	  })
			  })

		})
	})

	describe('POST /eyerx', function() {

		//set up app
		var app = TH.createApp()
		app.use('/', routes)
		app.testReady()

		before(function() {
			return db.deleteEverything()
		})


	  	var newUser1 = new TH.UserAttributes('imauser', 'password', 'something@gmail.com', '453-245-2423')
	  	var user1_id = undefined
	  	var newEyeRx1 = undefined

	  	it('returns the newly posted prescription', function() {
	  		return TH.createUserReturnIdAndToken(newUser1)
	  		  .then(function(userAndToken) {
	  		  	user1_id = userAndToken.id_user
	  		  	return request(app)
	  		  	  .post('/eyerx')
	  		  	  .set('x-access-token', userAndToken.token)
	  		  	  .expect(201)
	  		  	  .then(function(result) {
	  		  	  	var newEyeRx = JSON.parse(result)
	  		  	  	expect(newEyeRx).to.be.an('object')
	  		  	  	expect(TH.isValidPublicEyerx(newEyeRx)).to.be.true
	  		  	  	expect(TH.propsMatchExceptMaybeCurrent(newEyeRx, newEyeRx1)).to.be.true
	  		  	  })
	  		  })
	  	})

	  	it('adds a prescription to the database', function() {
	  		return EyeRx.getAllByUser(user1_id)
	  		  .then(function(allEyeRx) {
	  		  	expect(allEyeRx).to.be.an('array')
	  		  	expect(allEyeRx).to.have.length(1)
	  		  	expect(TH.isValidPublicEyerx(allEyeRx[0])).to.be.true
	  		  	expect(TH.propsMatchExceptMaybeCurrent(allEyeRx[0], newEyeRx1)).to.be.true
	  		  })
	  	})

	})

	describe('PUT /eyerx', function() {

		//set up app
		var app = TH.createApp()
		app.use('/', routes)
		app.testReady()

		before(function() {
			console.log('deleting everything - eyerx api')
			return db.deleteEverything()
		})

		var newUser1 = new TH.UserAttributes('imauser', 'password', 'something@gmail.com', '453-245-2423')
		var user1_id = undefined
		var newEyeRx1 = undefined
		var newEyeRx1_updated = undefined
		var eyerx1_id = undefined

	  	it('returns an updated prescription', function() {
	  		return TH.createUserReturnId(newUser1)
	  		  .then(function(id) {
	  		  	user1_id = id
	  		  	newEyeRx1 = new TH.EyeRxAttributes(user1_id, 2.25, 2.00, 2.00, -1.25, 20, 48, 2, 2)
	  		  	newEyeRx1_updated = new TH.EyeRxAttributes(user1_id, -1.50, 2.00, 2.00, -1.25, 20, 48, 2, 2)
	  		  	return EyeRx.createEyeRx(newEyeRx1)
	  		  })
	  		  .then(function(eyerx) {
	  		  	eyerx1_id = eyerx.id_eyerx
	  		  	return Auth.createToken(newUser1.username)
	  		  })
	  		  .then(function(token) {
	  		  	return request(app)
	  		  	  .put('/eyerx')
	  		  	  .set('x-access-token', token)
	  		  	  .send(JSON.stringify({id_eyerx: user1_id, sphere_right: newEyeRx1_updated.sphere_right}))
	  		  	  .expect(201)
	  		  	  .then( function(result) {
	  		  	  	var ob = JSON.parse(result)
	  		  	  	expect(ob).to.be.an('object')
	  		  	  	expect(TH.propsMatchExceptMaybeCurrent(ob, newEyeRx1_updated).to.be.true)
	  		  	  	expect(TH.propsMatchExceptMaybeCurrent(ob, newEyeRx1).to.be.false)

	  		  	  })
	  		  })
	  	})


	  	it('modifies the specified prescription in the database', function() {
	  		return EyeRx.getAllByUser()
	  		  .then(function(all) {
	  		  	expect(all).to.be.an('array')
	  		  	expect(all).to.have.length(1)
	  		  	expect(TH.propsMatchExceptMaybeCurrent(all[0], newEyeRx1_updated).to.be.true)
	  		  	expect(TH.propsMatchExceptMaybeCurrent(all[0], newEyeRx1).to.be.false)
	  		  })
	  	})


	})

	describe('DELETE /eyerx', function() {

		//set up app
		var app = TH.createApp()
		app.use('/', routes)
		app.testReady()

		before(function() {
			return db.deleteEverything()
		})

		var newUser1 = new TH.UserAttributes('imauser', 'password', 'something@gmail.com', '453-245-2423')
		var user1_id = undefined
		var newEyeRx1_id = undefined

		it('returns a 200 on a successful delete', function() {
			return TH.createUserReturnId(newUser1)
			  .then(function(id) {
			  	user1_id = id
			  	return EyeRx.createEyeRx(new TH.EyeRxAttributes(user1_id, 2.25, 2.00, 2.00, -1.25, 20, 48, 2, 2))
			  })
			  .then(function(eyerx) {
			  	newEyeRx1_id = eyerx.id_eyerx
			  	return Auth.createToken(newUser1.username)
			  })
			  .then(function(token) {
			  	return request(app)
			  	  .del('/eyerx')
			  	  .set('x-access-token', token)
			  	  .expect(200)
			  })
		})



	  	it('removes the prescription from the database', function() {
	  		return EyeRx.findById(newEyeRx1_id)
	  		  .then(function(deleted) {
	  		  	expect(deleted).to.be.an('undefined')
	  		  })
	  	})



	})

})

















