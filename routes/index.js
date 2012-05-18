
/*
 * GET home page.
 */

exports.index = function(req, res){
    console.log("test");
    res.render('index', { title: 'Express' })
};