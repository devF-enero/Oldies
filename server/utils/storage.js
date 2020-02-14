const cloudinary = require('cloudinary');

const storage = ({ stream }) => {

	cloudinary.config({
		cloud_name:'dhpqkkq4p',
		api_key:'813335637188354',
		api_secret:'gcdaoH8cJOagDZtSfHYbb25b1yQ'
	});

	return new Promise((resolve,reject) => {
		const buffer = cloudinary.v2.uploader.upload_stream((err,result) => {
			if(err) reject(err);
			resolve(result);
		});//chunks

		stream.pipe(buffer);

	});

};

module.exports = storage; 