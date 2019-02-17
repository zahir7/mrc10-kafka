'use strict';

var utils = require('../utils/writer.js');
var Query = require('../service/QueryService');


var users = require('../db/users');


module.exports.query = function query (req, res, next) {
  var xRequestUsername = req.swagger.params['X-request-username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;
  var xRequestUseToken = req.swagger.params['X-request-use-token'].value;
  var xRequestToken = req.swagger.params['X-request-token'].value;
  var channel = req.swagger.params['channel'].value;
  var chaincode = req.swagger.params['chaincode'].value;
  var _function = req.swagger.params['function'].value;
  var params = req.swagger.params['params'].value;

  //only strings in params, cause weird issues otherwise
  if (params)
  {
   params.every(function(element, index, array) {
     array[index] = element.toString();
   });
  }
  else {
    params = [];
  }

  //works
  if (xRequestUseToken)
  {
    var clientIP = req.connection.remoteAddress;
    console.log("USING TOKEN AUTH");
    //users.updatetoken("jx",clientIP,expire,function (){console.log("CALLBACK")});
    users.authByToken(xRequestToken, clientIP, function cb(ret){
      console.log("CALLBACK 2 valid :" + ret);
      if (!ret.valid)
      {
        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Invalid/Expired token provided");
      }
      else
      {

        console.log('succesfully identified');


        //var peerAddr = 'grpc://localhost:7051';
        var peerAddr = process.env.PEER_ADDR;
        console.log("peerAddr=", peerAddr);
        //var peerListenerAddr = 'grpc://localhost:7053';
        var peerListenerAddr = process.env.PEER_LISTENER_ADDR;
        console.log("peerListenerAddr=", peerListenerAddr);
        //var ordererAddr = 'grpc://localhost:7050';
        var ordererAddr = process.env.ORDERER_ADDR;
        console.log("ordererAddr=", ordererAddr);

        const request = {
          //targets : --- letting this default to the peers assigned to the channel
          chaincodeId: chaincode,
          fcn: _function,
          args: params
        };

        //console.log(req.body.param2);
        var query = require('../ledger/query.1.js');
        query.cc_query(ret.username, request, channel, peerAddr, ordererAddr, peerListenerAddr).then(
          (result) => {

            console.log(result);
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(result);
          }
        );







      }
    })
  }
  else
  {
  users.comparepwd(xRequestUsername, xRequestPassword, function (err, result) {
    if (err) {

        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Unauthorized");
		//returnResponse(res, 403, "Username or password invalid");
        //res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      //throw err;
    }
    else {
      console.log('user :' + JSON.stringify(result));
      if (result) {
        console.log('succesfully identified');


        //var peerAddr = 'grpc://localhost:7051';
        var peerAddr = process.env.PEER_ADDR;
        console.log("peerAddr=", peerAddr);
        //var peerListenerAddr = 'grpc://localhost:7053';
        var peerListenerAddr = process.env.PEER_LISTENER_ADDR;
        console.log("peerListenerAddr=", peerListenerAddr);
        //var ordererAddr = 'grpc://localhost:7050';
        var ordererAddr = process.env.ORDERER_ADDR;
        console.log("ordererAddr=", ordererAddr);






        const request = {
          //targets : --- letting this default to the peers assigned to the channel
          chaincodeId: chaincode,
          fcn: _function,
          args: params
        };

        //console.log(req.body.param2);
        var query = require('../ledger/query.1.js');
        query.cc_query(xRequestUsername, request, channel, peerAddr, ordererAddr, peerListenerAddr).then(
          (result) => {

            console.log(result);
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(result);
          }
        );



      }
      else
      {
        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Unauthorized");
	//	returnResponse(res, 403, "Username or password invalid");
		//res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      }
    }
  });

  /*
  Query.query(xRequestUsername,xRequestPassword,channel,chaincode,_function,params)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
    */
  }
};
