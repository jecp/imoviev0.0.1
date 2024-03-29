var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var User = require('./models/user')
var port = process.env.PORT || 4000
//var bodyParser = require('bodyparser')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var mongoStore = require('connect-mongo')(session)
var app = express()
var dbUrl = 'mongodb://localhost/ykjmb'

mongoose.connect(dbUrl)

app.set('views','./views/pages')
app.set('view engine', 'jade')
app.use(express.bodyParser())
app.use(cookieParser())
app.use(express.session({
	name: 'ykjmb.com',
	secret: 'ykjmb.com',
	resave: false,
	saveUnitialized: false,
	store: new mongoStore({
		url: dbUrl,
		auto_reconnect: true,
		collection: 'sessions'
	})
}))
//app.use(bodyParser.urlencoded({extended: false}))
//app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public')))
app.locals.moment = require('moment')
app.listen(port)

console.log('ykjmb started on port' + port)

// pre handle user
// app.use(function(req,res,next){
// 	var _user = req.session.user

// 	if(_user){
// 		app.locals.user = _user
// 		next()
// 		//return res.redirect('/')
// 	}
// 	return next()
// })


// index page
app.get('/', function(req, res){	
	console.log('user in session:')
	console.log(req.session.user)

	Movie.fetch(function(err, movies){
		if (err){
			console.log(err)
			//return
		}
		res.render('index',{
			title: '一看就明白 首页',
			movies: movies
		})
	})
})


// signup
app.post('/user/signup', function(req,res){
	var _user = req.body.user

	User.find({name: _user.name}, function(err,user){
		if (err){
			console.log(err)
		}
	})
		if (user){
			return res.redirect('/')
		}
		else{
			var user = new User(_user)
			user.save(function(err, user){
				if (err){
					console.log(err)
				}
			res.redirect('/admin/userlist')
		})
	}
})

// signin
app.post('/user/signin', function(req,res){
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	User.findOne({name: name}, function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			return res.redirect('/')
		}

		user.comparePassword(password, function(err, isMatch){
			if(err){
				console.log(err)
			}
			if (isMatch){
				req.session.user = user 
				console.log('password is matched.')
				return res.redirect('/')
			}
			else{
				console.log('password is not matched')
			}
		})
	})
})

// logout
app.get('/logout',function(req,res){
	delete req.session.user
	delete app.locals.user
	res.redirect('/')
})

// userlist page
app.get('/admin/userlist',function(req, res){
	User.fetch(function(err, users){
		if (err){
			console.log(err)
		}
		res.render('userlist',{
			title: '一看就明白 用户列表页',
			users: users
		})
	})
})

// detail page
app.get('/movie/:id',function(req, res){
	var id = req.params.id
	Movie.findById(id, function(err, movie){
		res.render('detail',{
		title: '一看就明白 ' + movie.title,
		movie: movie
		})
	})
})

// admin page
app.get('/admin/movie',function(req, res){
	res.render('admin',{
		title: '一看就明白 后台管理页',
		movie: {
			title: '',
			director: '',
			actor: '',
			category: '',
			imdb: '',
			country: '',
			language: '',
			year: '',
			stars: '',
			poster: '',
			flash: '',
			summary: ''
		}
	})
})

// update movie
app.get('/admin/update/:id', function(req, res){
	var id = req.params.id

	if(id){
		Movie.findById(id, function(err, movie){
			res.render('admin',{
				title: '一看就明白 后台更新页',
				movie: movie
			})
		})
	}
})


// admin post movie
app.post('/admin/movie/new', function(req, res){
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(id !== 'undefined'){
		Movie.findById(id, function(err, movie){
			if (err){
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie){
				if (err){
					console.log(err)
				}

				res.redirect('/movie/' + movie._id)
			})
		})
	}
	else {
		_movie = new Movie({
			director: movieObj.director,
			title: movieObj.title,
			actor: movieObj.actor,
			language: movieObj.language,
			country: movieObj.country,
			imdb: movieObj.imdb,
			category: movieObj.category,
			poster: movieObj.poster,
			summary: movieObj.summary,
			year: movieObj.year,
			stars: movieObj.stars,
			flash: movieObj.flash
		})

		_movie.save(function(err, movie){
			if (err){
				console.log(err)
			}
			res.redirect('/movie/' + movie._id)
		})
	}
})

// list page
app.get('/admin/list',function(req, res){
	Movie.fetch(function(err, movies){
		if (err){
			console.log(err)
		}
		res.render('list',{
			title: '一看就明白 列表页',
			movies: movies
		})
	})
})

// list delete movie
app.delete('/admin/list', function(req, res){
	var id = req.query.id

	if (id){
		Movie.remove({_id: id}, function(err, movie){
			if (err){
				console.log(err)
			}
			else{
				res.json({success: 1})
			}
		})
	}
})
