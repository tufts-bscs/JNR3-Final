const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI;
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
		  res.write("This is the home page<br>");
// 		txt = "";
          res.write(txt);
          res.end();
		  });
	  }
	  else if (req.url == "/process")
	  {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write  ("<html><head><style>html{background-color:#80FFB3;}</style><script src='dbquery.js'></script></head>");
		res.write("<body>Here's Your Current Playlist<br />");
		res.write("<table>");
		res.write("<tr><th>Title</th><th>Artist</th><th>Add</th></tr>");
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
						  res.write("<tr><td><a href ='https://jnr3-karaoke.herokuapp.com/" + items[i].track_id + ".xml'>" + items[i].title + "</a></td><td>" + items[i].artist + "</td></tr>");
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
