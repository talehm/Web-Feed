
const mysql = require('mysql');
const express = require('express');
var cors= require('cors');
const bodyParser = require('body-parser');
const app = express();
const Feed =require("feed").Feed;
var async = require('async');
let Parser = require('rss-parser');
let parser = new Parser();
var request = require('request');
var dateFormat = require('dateformat');
var now = new Date()

const connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'taleh',
    password : '110106016',
    database : 'webfeed',
    multipleStatements: true,
    charset: "utf8_general_ci"
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
function updateFeeds(){
   console.log("Updating Database");
   //console.log(now)
  async.parallel([
    function(callback) {
        sql="SELECT * FROM providers where active=1; SELECT timing from settings where type='aging';"
        connection.query(sql,[1,2], function (error, results) {
            if (error) throw error;

            results[0].map((provider,key)=>{
               fetchFeed(results[1][0].timing,provider.id,provider.url)
            })

        });
        connection.query('SELECT TIMEDIFF( p.lastUpdate,l.date) as time from logs l inner join providers p on l.type="INSERTED_RECORDS"', function(error,results){
           var time=results[0].time;

          // console.log(interval);
          if (time){
           if (calcTimeInterval(time)>0){
            connection.query('UPDATE logs SET date=NOW(), text=0 where type="INSERTED_RECORDS"')
           }
            if(results[0].log_date!=results[0].up_date){
            console.log("nothing added");
           }
        }
        })
    }]
   ,function(err, results) {
  });
}
//console.log(module.rowCount());
function calcTimeInterval(array){
    var arr=array.split(":");
    var hour=arr[0];
    var minute=arr[1];
    var second=arr[2];
    var interval=hour*3600+minute*60+second;
    return interval;
}
function fetchFeed( aging,provider,url,){
    request(url, function (error, response, body) {

     if(response){
       if (response.statusCode==404){
        var update_query='UPDATE providers SET lastUpdate=NOW(), link=NULL, title="Error: Please Check the URL", lastBuildDate=NULL where id='+provider+' ';
        connection.query(update_query,[1]);
        }
       else if (response.statusCode==500){
            var update_query='UPDATE providers SET lastUpdate=NOW(), link=NULL, title="Error 500: Internal Server Error. Please contact the feed provider or choose another feed", lastBuildDate=NULL where id='+provider+' ';
            connection.query(update_query,[1]);
            }
       else{
        (async () => {
            let feedFetched=false;
            let feed = await parser.parseURL(url)

            if (feed){
                feedFetched=true
            }
            if(feedFetched){
                var update_query='UPDATE providers SET lastUpdate=NOW(), link="'+feed.link+'", title="'+feed.title+'", lastBuildDate="'+feed.lastBuildDate+'" where id='+provider+'';
                connection.query(update_query,[1]);

            }
            feed.items.forEach(item => {
                if(item.id){
                    var guid=item.id
                }
                else if(item.guid){
                    var guid=item.guid
                }

                guid=guid.substring(20).replace("[^a-zA-Z0-9]", "")
                var item_pubDate=dateFormat(item.pubDate, 'yyyy-mm-dd HH:mm:ss');

                connection.query('SELECT DATE_ADD("'+item_pubDate+'", INTERVAL '+aging+') as time', function(error,results){
                    var interval_date=new Date(results[0].time);
                    connection.query('SELECT id,pubDate FROM team where guid="'+guid+'"', function (error, results) {

                    if(interval_date>now){

                        if (error) throw error;
                        if (results.length===0 ){
                            connection.query('INSERT INTO team ( guid,provider,active,title,contentSnippet,content,url,pubDate,importDate ) VALUES ( "'+guid+'","'+provider+'", 1,"'+mysql.escape(item.title)+'","'+mysql.escape(item.contentSnippet)+'","'+mysql.escape(item.content)+'","'+mysql.escape(item.link)+'","'+dateFormat(item.pubDate, 'yyyy-mm-dd HH:mm:ss')+'",NOW() )');
                            connection.query('UPDATE logs SET date=NOW(),text=logs.text+1 where type="INSERTED_RECORDS"')

                            connection.query("SET GLOBAL event_scheduler = ON;")
                            connection.query('SELECT id,pubDate from team where guid="'+guid+'"', function (error, res) {
                                connection.query("DROP EVENT IF EXISTS event"+res[0].id);
                                var pubDate=dateFormat(res[0].pubDate, 'yyyy-mm-dd HH:mm:ss');
                                connection.query(' CREATE EVENT IF NOT EXISTS event'+res[0].id+
                                                ' ON SCHEDULE AT (SELECT DATE_ADD("'+pubDate+'", INTERVAL '+aging+'))'+
                                                    ' DO '+
                                                    ' delete from team where id='+res[0].id+' ')
                            });
                        }
                        else{
                            connection.query('SELECT id,pubDate from team where guid="'+guid+'"', function (error, res) {
                                connection.query("DROP EVENT IF EXISTS event"+res[0].id);
                                var pubDate=dateFormat(res[0].pubDate, 'yyyy-mm-dd HH:mm:ss');
                                if (interval_date>now){
                                    connection.query(' CREATE EVENT IF NOT EXISTS event'+res[0].id+
                                    ' ON SCHEDULE AT (SELECT DATE_ADD("'+pubDate+'", INTERVAL '+aging+'))'+
                                    ' DO '+
                                    ' delete from team where id='+res[0].id+' ')
                                }

                            });
                            results.forEach(result => {
                                var db_item_date=new Date(result.pubDate).getTime();
                                var feed_item_date=new Date(dateFormat(item.pubDate, 'yyyy-mm-dd HH:mm:ss')).getTime();
                                if(db_item_date!=feed_item_date){
                                    connection.query('UPDATE team SET title="'+mysql.escape(item.title)+'",contentSnippet="'+mysql.escape(item.contentSnippet)+'", content="'+mysql.escape(item.content)+'",url="'+item.link+'", pubDate="'+dateFormat(item.pubDate, 'yyyy-mm-dd HH:mm:ss')+'" where guid="'+guid+'"');
                                    connection.query('UPDATE logs SET date=NOW(),text=logs.text+1 where type="UPDATED_RECORDS"')
                                }
                            });
                        }

                }
                else{
                    connection.query('SELECT id,pubDate from team where guid="'+guid+'"', function (error, res) {
                        if (res.length!=0){
                         connection.query("DROP EVENT IF EXISTS event"+res[0].id);
                        }
                     });
                    connection.query("DELETE from team where guid='"+guid+"'");
                }
            });
            });

            });
        })();
       }
    }
    else{
        var update_query='UPDATE logs SET date=NOW(), text="Feed URL is wrong!!" where type="FETCH_ERROR";'+
                         'UPDATE providers SET lastUpdate=NOW(), link=NULL, title="Error 404: Please Check the URL", active=0, lastBuildDate=NULL where id='+provider+' ';
        connection.query(update_query,[1,2]);
    }
      });
}
var interval;
function updateInterval(aging){
    if(!aging){
        var aging="30 DAY"
    }

    connection.query('SELECT timing FROM settings where type="update"', function (error, respond) {
        if (error) throw error;
            if (interval){
                clearInterval(interval);
            }
        interval=setInterval(updateFeeds, respond[0].timing)
      });
}
updateInterval();
updateFeeds();

app.post('/fetch_feeds', function (req, res) {
    var providerId = req.body.id;
    if (providerId="all"){
        var sql="SELECT * FROM team GROUP BY pubDate desc;"
        connection.query(sql,[1], function (error, results) {
            if (error) throw error;
            res.send(results)
          });
          

    }
    else{
    connection.query('SELECT * FROM team where provider="'+providerId+'"', function (error, results) {
        if (error) throw error;
        res.send(results)
      });
    }
});
app.post('/set_providers', function (req, res) {
    var name = req.body.name;
    var url = req.body.url;
    connection.query('INSERT INTO providers (name,url,lastUpdate,link,title,lastBuildDate, active) VALUES ("'+name+'", "'+url+'", NULL,NULL,NULL,NULL,1)', function (error, results) {
        if (error) throw error;
        if(results.affectedRows>0){
            connection.query('SELECT * FROM providers', function (error, respond) {
                if (error) throw error;
                res.send(respond)

              });
        }
      });
});
app.get('/fetch_providers', function (req, res) {
    connection.query('SELECT * FROM providers', function (error, results) {
        if (error){ throw error;}
        res.send(results)
      });

});
app.get('/fetch_settings', function (req, res) {
    connection.query('SELECT * FROM settings', function (error, results) {
        if (error){ throw error;}
        res.send(results)
      });
});

app.get('/update_providers', function (req, res) {
    updateFeeds();
    connection.query('SELECT * FROM providers', function (error, results) {
        if (error) throw error;
        res.send(results)
      });
});
app.get('/fetch_logs', function (req, res) {
    updateFeeds();
    connection.query('SELECT * FROM logs', function (error, results) {
        if (error) throw error;
        res.send(results)
      });
});
app.post('/edit_providers', function (req, res) {
    var name = req.body.name;
    var url = req.body.url;
    var id = req.body.id;
    connection.query('UPDATE providers SET name="'+name+'",  url="'+url+'" where id='+id+'');
    connection.query('SELECT * FROM providers', function (error, results) {
        if (error) throw error;
        res.send(results)
      });
});
app.post('/delete_providers', function (req, res) {
    var id = req.body.id;
    connection.query('DELETE from providers where id='+id+'');
    connection.query('DELETE FROM team where provider='+id+'');
    connection.query('SELECT * FROM providers', function (error, results) {
        if (error) throw error;
        res.send(results)
      });
});
app.post('/change_update_interval', function (req, res) {
    var interval = req.body.interval;
    connection.query('UPDATE settings SET timing='+interval+' where type="update"');
    updateInterval();
});

app.post('/change_aging_interval', function (req, res) {
    var interval = req.body.interval;
    connection.query('UPDATE settings SET timing="'+interval+'" where type="aging"');
    connection.query('SELECT * FROM providers', function (error, results) {
        if (error) throw error;
        res.send(results)
      });
      updateInterval();
      updateFeeds();
});

app.post('/enable_provider', function (req, res) {
    var id = req.body.id;
    var active=req.body.active;

    if (active==1){
        connection.query('UPDATE providers SET active=0 where id='+id+'');
    }
    if(active==0){
        connection.query('UPDATE providers SET active=1 where id='+id+'');
    }

    //updateFeeds()
    connection.query('SELECT * FROM providers', function (error, results) {
        if (error) throw error;
        res.send(results)
      });

});
app.post('/enable_feeds', function (req, res) {
    var id = req.body.id;
    var active=req.body.active;
    var provider=req.body.provider;

    if (active==1){
        connection.query('UPDATE team SET active=0 where id='+id+' and provider='+provider+'');
    }
    if(active==0){
        connection.query('UPDATE team SET active=1 where id='+id+' and provider='+provider+'');
    }
    connection.query('SELECT * FROM team where provider="'+provider+'"', function (error, results) {
        if (error) throw error;
        res.send(results)
    });

});

app.get('/provide_rss_feed', function (req, res) {
    GenerateRSS(res,"rss");
});
app.get('/provide_atom_feed', function (req, res) {
    GenerateRSS(res,"atom");
});


function GenerateRSS(res,format){
    connection.query('SELECT * FROM team', function(error, results){
        const feed = new Feed({
            version: "http://www.ourteam.com",
            title: "Our "+format+" Web Feed",
            description: "This is my personal feed!",
            id: "http://ourteam.com/",
            link: "http://ourteam.com/",
            language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
            image: "http://ourteam.com/image.png",
            favicon: "http://ourteam.com/favicon.ico",
            copyright: "All rights reserved 2013, John Doe",
            generator: "awesome", // optional, default = 'Feed for Node.js'
            feedLinks: {
              json: "http://www.ourteam.com::3200/provide_json_feed",
              atom: "http://www.ourteam,com:3200/provide_atom_feed",
              rss: "http://www.ourteam.com:3200/provide_rss_feed",
            },
            author: {
              name: "Taleh Muzaffarov",
              email: "talehmuzaffer@gmail.com",
              link: "https://github.com/talehm"
            }
          });
            feed.addCategory("News Feed");
            feed.addContributor({
                name: "Rajat Ghosh",
                email: "rajatghosh52@gmail.com",
                link: "https://rajatghosh52.com/rajat"
            });
           results.forEach(post => {
               var guid=post.url.replace(/["']/g, "");
               var check = guid.substring(guid.length - 3, guid.length);
               if (check!="own"){
                    guid=post.url.replace(/["']/g, "")+"own";
               }
               title=post.title.replace(/["']/g, "");
               link=post.url.replace(/["']/g, "");
               content=post.content.replace(/["']/g, "");
               contentSnippet=post.contentSnippet.replace(/["']/g, "");
               pubDate=dateFormat(post.pubDate, 'ddd, dd mmm yyyy HH:MM:ss');
               isoDate=new Date(dateFormat(post.pubDate, "UTC:yyyy-mm-dd'T'HH:MM:ss.l'Z'"));
            feed.addItem({
                title: title,
                guid: guid,
                link: guid,
                content: content,
                contentSnippet:contentSnippet,
                pubDate: pubDate,
                date: isoDate,
              });
          });
          switch(format){
              case 'rss':
                  res.send(feed.rss2());
                  break;
              case 'atom':
                  res.send(feed.atom1());

          }

       })
}




   app.listen(3300, () => {
    console.log('Server Running!!!');
    //server.close();
   });
