
/*
 * GET movies page.
 */

exports.movies = function(req, res){
    console.log("test");
    res.render('movies', { title: 'movies controller' })
};