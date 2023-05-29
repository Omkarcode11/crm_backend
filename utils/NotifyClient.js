let Client = require('node-rest-client').Client

let client = new Client()


module.exports = (ticketId,subject,content,recipientEmails,requester)=>{
    let reqBody = {
        ticketId,subject,content,recipientEmails,requester
    }



    let args = {
        data : reqBody,
        headers:{'Content-Type':"application/json"}
    }

    client.post("http://localhost:7777/notificationSErvice/api/v1/notification",args,function(data,res){
        console.log(data)
    })
}