const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://rriver03:rriver03@cluster0.ot60c.mongodb.net/playlists?retryWrites=true&w=majority";
var http = require('http');
var port = process.env.PORT || 3000;
var fs = require('fs');
var qs = require('querystring');

http.createServer(function (req, res) 
  {
	  if (req.url == "/")
	  {
		  file = 'formpage.html';
		  fs.readFile(file, function(err, txt) {
    	  res.writeHead(200, {'Content-Type': 'text/html'});
		  res.write("Wecome to Karaoke Lyric Kingdom! <br>");
		//   txt = "";
          res.write(txt);
          res.end();
		  });
	  }
	  else if (req.url == "/process")
	  {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write  ("<html><head><style>html{background-color:#EDAE49; font-family: cursive;}</style></head>");
		res.write("<body><style>html{background-image: linear-gradient(#EDAE49, #d1495b); text-align: center; font-size: 60px;}</style>Available Songs:<br />");
		res.write("<a style='font-size: 20px;' href = 'https://jnr3-karaoke.herokuapp.com/'>Back to Search</a><br><br>");
		res.write("<table align='center' style='font-size:40px'>");
		res.write("<tr><th>Title</th><th>Artist</th></tr>");
		 pdata = "";
		 req.on('data', data => {
           pdata += data.toString();
         });

		// when complete POST data is received
		req.on('end', () => {
			pdata = qs.parse(pdata);

			MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, db) {
				if(err) {
					console.log("Connection err: " + err); return;
				}
	  
				var dbo = db.db("playlists");
				var coll = dbo.collection('songs');
				console.log("before find");
				theQuery = {artist: pdata['the_artist']};
				console.log("after theQuery")
				coll.find(theQuery).toArray(function(err, items) {
				  if (err) {
					console.log("Error: " + err);
				  }
				  else
				  {
					  console.log("before res.write for loop");
					
	  
					  for (i=0; i<items.length; i++) {
						  res.write("<tr><td><a href ='http://bscs19.epizy.com/" + items[i].track_id + ".xml'>" + items[i].title + "</a></td><td>" + items[i].artist + "</td></tr>");
					  }
				  }
				  res.end("</table></body></html>");
				  db.close();
				console.log("after close");
				});  //end find
		  });
		});
	  }
	  else 
	  {
		  res.writeHead(200, {'Content-Type':'text/html'});
		  res.write ("Unknown page request");
		  res.end();
	  }
}).listen(port);
