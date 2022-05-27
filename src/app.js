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


const firebaseConfig = {
    apiKey: "AIzaSyD8Znx45accgfmJuvi_pe9SKo7OoQ7JtE0",
    authDomain: "online-meeting-73126.firebaseapp.com",
    projectId: "online-meeting-73126",
    storageBucket: "online-meeting-73126.appspot.com",
    messagingSenderId: "674919510574",
    appId: "1:674919510574:web:9c86c58ca200a726c565bf",
    measurementId: "G-QE5MSJFKTL"
  };

// Initialize Firebase
const appinit = initializeApp(firebaseConfig);

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