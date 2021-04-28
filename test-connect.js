const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://rriver03:rriver03@cluster0.ot60c.mongodb.net/playlists?retryWrites=true&w=majority";

  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
  if(err) { return console.log(err); return;}
  
  var dbo = db.db("playlists");
	var collection = dbo.collection('songs');
  console.log("before find");
  //theQuery = {artist:"CHIKA"};
  // theQuery = "";
  var s = collection.find().stream();
  s.on("data", function(item) {console.log("Data " + item.title)});
  s.on("end", function() {console.log("end of data");
  db.close();});
  console.log("after close");
  // collection.find(theQuery).*toArray(function(err, items) {
  //   if(err) {
  //     console.log("Error:" + err);
  //   }
  //   else {
  //     console.log("Songs: ");
  //     for (i=0; i<items.length; i++)
  //       console.log(i + ":" + items[i].title + " by: " 
  //       + items[i].artist); 
  //   }
  //   db.close();
  //   console.log("after close");
  // }); // end find
}); // end connect
