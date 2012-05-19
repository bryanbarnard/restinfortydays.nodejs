function saveMovies() {
    fs.writeFile('movieList.json', JSON.stringify(movieList), 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        } else {
            console.log("movieList => movieList.json");
        }
    });
}

function loadMovies() {
    fs.readFile('movieList.json', 'utf8', function (err, data) {
        if (err) {
            return console.log("error: " + err);
        }
        movieList = JSON.parse(data);
        console.log(movieList);
        console.log("Movies Loaded...");
    });
}

/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore')._,
    movieList = loadMovies();

var app = module.exports = express.createServer();

// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// Routes

//api routes

/* GET /api */
app.get('/api', function (req, res) {
    return res.send("API is running...!");
});

/* GET /api/movies */
app.get('/api/movies', function (req, res) {
    return res.json(movieList,200);
});

/* GET /api/movies/1 */
app.get('/api/movies/:id', function (req, res) {
    var movie = _.find(movieList.movies, function(movie) {return movie.id == req.params.id;});
    if(!movie){
        return res.json({result:"Not Found"}, 404);
    } else {
        return res.json(movie, 200);
    }
});

/* SAMPLE POST */
//POST /api/movies HTTP/1.1
//Host: localhost:3000
//Connection: keep-alive
//Content-Length: 44
//Cache-Control: max-age=0
//Origin: http://localhost:3000
//    User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.46 Safari/536.5
//Content-Type: application/x-www-form-urlencoded
//Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
// Referer: http://localhost:3000/testforms.html
// Accept-Encoding: gzip,deflate,sdch
// Accept-Language: en-US,en;q=0.8
// Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.3
//
// id=3&title=Caddyshack&genre=Comedy&year=1978

/* POST /api/movies */
app.post('/api/movies', function (req, res) {
    console.log('POST: ');
    console.log(req.body);
    var movie = {
    id: req.body.id,
    title:  req.body.title,
    year:   req.body.year,
    genre:  req.body.genre
    };

    // add to list of movies
    movieList.movies.push(movie);
    saveMovies();
    return res.json(movie, 200);
});

//todo: implement
app.delete('/api/movies/:id', function (req, res) {
    console.log('delete ' + req.params.id + 'from movies');
    return res.send('');
});

/* PUT /api/movies/1 */
app.put('/api/movies/:id', function (req, res) {
    console.log('PUT: ');
    console.log(req.body);
    var movie = _.find(movieList.movies, function(movie) {return movie.id == req.params.id;});
    if(!movie){
        return res.json({result : "not found"}, 404)
    } else {
        movie.title = req.body.title;
        movie.year = req.body.year;
        movie.genre = req.body.genre;
        saveMovies();
        return res.json(movie, 200);
    }
});

/* DELETE /api/movies/1 */
app.delete('/api/movies/:id', function (req, res) {
   console.log('DELETE: ' + req.params.id);
   var movie = _.find(movieList.movies, function(movie) {return movie.id == req.params.id;});
   if(!movie){
       movieList = _.filter(movieList.movies, function(movie) {return movie.id != req.params.id});
       saveMovies();
       return res.json({"result" : "removed"}, 200);
   }

});

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
