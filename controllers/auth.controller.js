var mysql = require('mysql');
var con = require('../mysql-connection')
var md5 = require('md5')


module.exports.login = function (req, res, next) {
	res.render('auth/login');
};
module.exports.postLogin = function (req, res, next) {
	var readerId = req.body.readerId;
	var password = req.body.password;
	con.query('SELECT * FROM readers WHERE readerId = ?',[readerId], function (err, result) { //result trả về 1 array chứa object
		//console.log(typeof result[0].username)

     var ngayHetHan = result[0].ngayHetHan;

      x =  ngayHetHan.slice(0, 2);
      y =  ngayHetHan.slice(3, 5);
      z =  ngayHetHan.slice(6,10);

      var g = new Date();
      g.setDate(x);
      g.setMonth(y-1);
      g.setFullYear(z);
       var date = new Date(g);
      var e = date.getTime();
      var now = new Date();
      var f = now.getTime();
      if(f <= e){
		if (err) throw err;
		if(result[0] === undefined || result[0].readerId !== readerId) {
			res.render('auth/login', {
				errors:[
					'Id does not exists'
				],
				values: req.body
			});
			return;
		}

		var hashedPassword = md5(password)

		if(result[0].password !== hashedPassword){
			res.render('auth/login', {
				errors:[
					'Wrong password!'
				],
				values: req.body
			});
			return;
		}
		req.session.readerId = result[0].readerId;

		//req.session.username = result[0].username;
		console.log(result[0].userId)

		if (result[0].userId.localeCompare("3") == 0){
		res.redirect('/borrowing');
		}
		else if(result[0].userId.localeCompare("2")  == 0){
     	res.redirect('/library');
		}
		else if(result[0].userId.localeCompare("1")  == 0){
     	res.redirect('/librarians');
		}
	} else {
		res.render('auth/login', {
						errors:[
					'Thẻ của bản đã quá hạn, bạn cần phải đến chỗ thủ thư để mở khóa!!'
				],
				values: req.body
			});
				return;
	};
});
};