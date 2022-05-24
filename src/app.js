let express = require( 'express' );
let app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let stream = require( './ws/stream' );
let path = require( 'path' );
let favicon = require( 'serve-favicon' );
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

app.use( favicon( path.join( __dirname, 'favicon.ico' ) ) );
app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://server-auth-41acc.firebaseio.com",
});

app.get( '/', ( req, res ) => {
    res.sendFile( __dirname + '/index.html');
} );

io.of( '/stream' ).on( 'connection', stream );

app.get( '/home', ( req, res ) => {
    res.sendFile( __dirname + '/views/home.html' );
} );

app.get( '/login', ( req, res ) => {
    res.sendFile( __dirname + '/views/loginpage.html' );
} );

app.get('/register', (req, res)=>{
    res.sendFile( __dirname + '/views/registerpage.html')
} );

server.listen( 3000 );