var io = require("socket.io-client");

socket = io("http://ec2-52-26-81-246.us-west-2.compute.amazonaws.com:8080");

socket.emit('live',JSON.stringify({
    endpoint:"plug",
    action:"get",
    lat:0.5,
    lon:0.5,
    radius:10
    }));

socket.on("live",function(data){
      console.log("data");
      console.log(data);
    });