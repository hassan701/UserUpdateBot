import DiscordJS, { IntentsBitField  } from 'discord.js'
import dotenv from "dotenv"

import { MongoClient } from 'mongodb'
import { CronJob } from 'cron'

dotenv.config()

var dbo
var TotalNumberofUsers

const client = new DiscordJS.Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.DirectMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessageTyping
    ]
})


client.on('ready', () => {
    console.log('Bot online and connected to server!')
    MongoClient.connect(process.env.MONGO_URI, function(err, db) {
        if (err) throw err;
        dbo = db.db(process.env.Mongo_Cname);
        dbo.collection(process.env.Mongo_dbname).countDocuments().then((count_documents) => {
            console.log(count_documents);
            TotalNumberofUsers = count_documents;
          }).catch((err) => {
            console.log(err.Message);
          })
      },
        CheckifUsersAdded.start()
        ) 
})



var CheckifUsersAdded = new CronJob('*/1 * * * *', function() { 
    dbo.collection("testings").countDocuments({}, function( err, CurrenNumofUsers){
        if(TotalNumberofUsers<CurrenNumofUsers){
            while(CurrenNumofUsers>TotalNumberofUsers){
                client.channels.cache.get(process.env.BOT_CHANNEL).send('A New Account has been Created');
                console.log("Bot send message for a new student")
                TotalNumberofUsers++; 
            }
        }else{
            console.log("No new Users, Current Users:", CurrenNumofUsers)
        }
    })
}, null, true, 'America/Los_Angeles');

 



client.login(process.env.BOT_TOKEN)



  