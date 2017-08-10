var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection); 
var bcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');
var urlencodedparser = bodyParser.urlencoded({extended:false})


module.exports = function(app,passport) {

    
    app.get('/',isLoggedIn,function(req,res){
        var row = [];
        var row2=[];
        var row3=[];

        connection.query('select * from users where id = ?',[req.user.id], function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                if (rows.length) {
                    for (var i = 0, len = rows.length; i < len; i++) {  //query den gelen bütün parametreleri rows sınıfına ekliyoruz .
                        row[i] = rows[i];
                        
                    }  
                }
                
                
            }

            connection.query("update static set views = views + 1 where id = 1");
            connection.query('select * from static where id = 1',function(err,rows1){
                
                console.log(rows1);
                if (err) {
                    console.log(err);
                } else {
                    if (rows1.length) {
                        for (var i = 0, len = rows1.length; i < len; i++) {  //query den gelen bütün parametreleri rows sınıfına ekliyoruz .
                            row2[i] = rows1[i];
                        }  
                    }
                    
                    
                }
            })
            connection.query('select posts.id,username,text,likes from users inner join posts on users.id = posts.userID', function (err, rows2) {
                if (err) {
                    console.log(err);
                } else {
                    if (rows2.length) {
                        for (var i = 0, len = rows2.length; i < len; i++) {  //query den gelen bütün parametreleri rows sınıfına ekliyoruz .
                            row3[i] = rows2[i];
                        }  
                    }
                    
                    
                }
                console.log("rows"+row);
        console.log("rows1"+row2);
        console.log("rows2"+row3);
        res.render('index.ejs', {rows : row,rows1:row2,rows3:row3}); 
                
            });
            
        });
        
    });



    app.get('/api/user',isLoggedIn,function(req,res){
        var row = [];
        connection.query('select username from users where id = ?',[req.user.id], function (err, rows) {
            

            res.json(rows);
        });
      
    });



    app.get('/api/todos',function(req,res){
        var row = [];
      connection.query('select posts.id,username,text,likes from users inner join posts on users.id = posts.userID', function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                if (rows.length) {
                    for (var i = 0, len = rows.length; i < len; i++) {  //query den gelen bütün parametreleri rows sınıfına ekliyoruz .
                        row[i] = rows[i];
                    }  
                }
                console.log(row);
                
            }
            res.json(rows);
            
        });
    });

    app.get('/api/viewcomments/:postID',function(req,res){
        var postID = req.params.postID;
        var row = [];
        console.log(postID);
        connection.query('select users.username as u ,t1.y as t,t1.idsi as idsi1 from (select comments.id as k,comments.text as y,comments.userID as x,posts.id as idsi from comments inner join posts on posts.id = comments.postID where posts.id= "'+postID+'" ) as t1 , users where users.id = t1.x  order by k desc limit 4 ', function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                if (rows.length) {
                    for (var i = 0, len = rows.length; i < len; i++) {  //query den gelen bütün parametreleri rows sınıfına ekliyoruz .
                        row[i] = rows[i];
                    }  
                }
                console.log(row);
                
            }
            res.json(rows);
            
        });
    });

    app.post('/api/todos',function(req,res){
        var row = [];
        var row2=[];
        connection.query('select * from users where id = ?',[req.user.id], function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                if (rows.length) {
                    for (var i = 0, len = rows.length; i < len; i++) {  //query den gelen bütün parametreleri rows sınıfına ekliyoruz .
                        row[i] = rows[i];  
                    }  
                }
                console.log(row);
            }
            connection.query('insert into posts(text,userID,likes) values("'+req.body.gonderi_icerik+'","'+req.user.id+'",0)');
            connection.query('select username,text,likes from users inner join posts on users.id = posts.userID',function(err,rows2){
                if(err){
                    console.log(err);
                }else{
                    res.json(rows2);
                }
                
            })
        });
  });


    app.post('/api/comments/:postID',isLoggedIn,function(req,res){
        var postID = req.params.postID;
        var comment = req.body.commenttext;
        connection.query('insert into comments(text,userID,postID) values("'+comment+'","'+req.user.id+'","'+postID+'")')


    });


    app.get('/api/viewlikes/:postID',isLoggedIn,function(req,res){
        var postID = req.params.postID;
        var row = [];
      connection.query('select likes from posts where id=?',[postID], function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                if (rows.length) {
                    for (var i = 0, len = rows.length; i < len; i++) {  //query den gelen bütün parametreleri rows sınıfına ekliyoruz .
                        row[i] = rows[i];
                    }  
                }
                console.log(row);
                
            }
            res.json(rows);
            
        });
    });

    app.get('/api/like/:postID',isLoggedIn,function(req,res){
        console.log("like post");
        var postID = req.params.postID;
        connection.query("update posts set likes=likes+1 where id='"+postID+"'")
      
    });








    app.get('/error',function(req,res){

        res.render("error.ejs");

    });

    app.get('/login', function(req, res) {

        res.render('login.ejs',{ message: req.flash('loginMessage') });

    });

    app.get('/signup', function(req, res){
        res.render('signup.ejs',{message: req.flash('message')});
      });

    app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/login',
            failureRedirect: '/signup',
            failureFlash : true 
    }));

    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', 
            failureRedirect : '/login',
            failureFlash : true 
        }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


};


function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect('/login');
}

