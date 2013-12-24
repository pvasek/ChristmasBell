
/**
 * Module dependencies.
 */

var express = require('express');
var socketio = require('socket.io');
var _ = require('underscore');
var routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'vash');
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/*', routes.index);

console.log('socketio starting...');
var io = socketio.listen(app);
console.log('socketio listening...');
app.listen(process.env.port);

console.log('socketio OK');

var connections = {};
function getConnection(id) {
  var result = connections[id];
  if (!result) {
    result = {
      bells: [],
      ropes: []
    };
    connections[id] = result;
  }
  return result;
}

function removeFromBells(socket) {
  var conn = _.find(connections, function(conn) {
    return _.contains(conn.bells, socket);
  });
  if (conn) {
    conn.bells = _.without(conn.bells, socket);
  }
  return conn;
}

function removeFromRopes(socket) {
  var conn = _.find(connections, function(conn) {
    return _.contains(conn.ropes, socket);
  });
  if (conn) {
    conn.ropes = _.without(conn.ropes, socket);
  }
  return conn;
}


var notifyAll = function(conn) {
    var data = {ropeCount: conn.ropes.length, bellCount: conn.bells.length};
    conn.bells.forEach(function(item){
      item.emit('bell-changed', data);
    });
    conn.ropes.forEach(function(item){
      item.emit('bell-changed', data);
    });
};

io.sockets.on('connection', function (socket) {

  console.log('SC: connecting');

  socket.on('connect-bell', function (data) {
    console.log('SC: connect-bell');
    var conn = getConnection(data.id);
    conn.bells.push(socket);
    notifyAll(conn);
  });

  socket.on('connect-rope', function (data) {
    console.log('SC: connect-rope');
    var conn = getConnection(data.id);
    conn.ropes.push(socket);
    notifyAll(conn);
  });

  socket.on('ring-bell', function (data) {
    console.log('SC: ring-bell');
    var conn = getConnection(data.id);
    conn.bells.forEach(function(item){
      item.emit('ringing', data);
    });
  });

  socket.on('disconnect', function (data) {
    console.log('SC: disconnecting');
    var conn = removeFromBells(socket) ||
      removeFromRopes(socket);
      notifyAll(conn);

    // TODO: notify clients
    //item.emit('bell-changed', {ropeCount: conn.ropes.length, bellCount: conn.bells.length});

  });

});

//console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
