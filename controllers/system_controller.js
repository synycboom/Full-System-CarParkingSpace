var WebUserToken = require('../app/models/web_user_token');

var method = {
	insertToken: function(data, callback){
		console.log(data);

		WebUserToken.findOne({ 'token' :  data.token }, function(err, token) {
            if (err){
            	callback(err);
            }

            // check to see if theres already a token with that token
            if (token) {
                callback('duplicated');
            } else {

                // if there is no user with that token
                // create the token
                var newUserToken = new WebUserToken();

                newUserToken.token = data.token;
                newUserToken.name = data.name;
                newUserToken.username = data.username;
                newUserToken.latitude = data.latitude;
                newUserToken.longtitude = data.longtitude;

                // save the token
                newUserToken.save(function(err) {
                    if (err)
                        throw err;
                    callback("success");
                });
             }
        });    
	}
};

module.exports = method;