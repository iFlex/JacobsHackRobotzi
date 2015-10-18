var io = require("socket.io-client");

socket = io("https://portalvhdsw4758qvt0rmdk.blob.core.windows.net/vhds/robotzi2-robotzi2-2015-10-12.vhd");

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