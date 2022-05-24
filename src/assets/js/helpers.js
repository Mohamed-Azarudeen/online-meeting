import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc, deleteDoc, deleteField } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js';

var roomnamefromdb="empty";
var roompasswordfromdb="empty";
export default {
    generateRandomString() {
        const crypto = window.crypto || window.msCrypto;
        let array = new Uint32Array(1);
        
        return crypto.getRandomValues(array);
    },
    
    closeVideo( elemId ) {
        if ( document.getElementById( elemId ) ) {
            document.getElementById( elemId ).remove();
            this.adjustVideoElemSize();
        }
    },


    pageHasFocus() {
        return !( document.hidden || document.onfocusout || window.onpagehide || window.onblur );
    },


    getQString( url = '', keyToReturn = '' ) {
        url = url ? url : location.href;
        let queryStrings = decodeURIComponent( url ).split( '#', 2 )[0].split( '?', 2 )[1];
        console.log(queryStrings);

        if ( queryStrings ) {
            let splittedQStrings = queryStrings.split( '&' );

            if ( splittedQStrings.length ) {
                let queryStringObj = {};

                splittedQStrings.forEach( function ( keyValuePair ) {
                    let keyValue = keyValuePair.split( '=', 2 );

                    if ( keyValue.length ) {
                        queryStringObj[keyValue[0]] = keyValue[1];
                    }
                } );

                return keyToReturn ? ( queryStringObj[keyToReturn] ? queryStringObj[keyToReturn] : null ) : queryStringObj;
            }

            return null;
        }

        return null;
    },


    userMediaAvailable() {
        return !!( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );
    },


    getUserFullMedia() {
        if ( this.userMediaAvailable() ) {
            return navigator.mediaDevices.getUserMedia( {
                video: true,
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            } );
        }
        else {
            throw new Error( 'User media not available' );
        }
    },


    getUserAudio() {
        if ( this.userMediaAvailable() ) {
            return navigator.mediaDevices.getUserMedia( {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true
                }
            } );
        }

        else {
            throw new Error( 'User media not available' );
        }
    },

    shareScreen() {
        if ( this.userMediaAvailable() ) {
            return navigator.mediaDevices.getDisplayMedia( {
                video: {
                    cursor: "always"
                },
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            } );
        }
        else {
            throw new Error( 'User media not available' );
        }
    },

    getIceServer() {
        return {
            iceServers: [
                {
                    urls: [ 
                        "stun:bn-turn1.xirsys.com" 
                    ]
                }, 
                {
                    username: "8Ew07GRmcyIIk84nqIc_0RYr7G10s-riIMjJqfdtDl9soDFpfis5U5dtb62zq4GhAAAAAGJgJk1zbWE5Njk4OTI5Nzk4",
                    credential: "57e8cd3e-c0be-11ec-8414-0242ac140004",
                    urls: [
                    "turn:bn-turn1.xirsys.com:80?transport=udp",
                    "turn:bn-turn1.xirsys.com:3478?transport=udp",
                    "turn:bn-turn1.xirsys.com:80?transport=tcp",
                    "turn:bn-turn1.xirsys.com:3478?transport=tcp",
                    "turns:bn-turn1.xirsys.com:443?transport=tcp",
                    "turns:bn-turn1.xirsys.com:5349?transport=tcp"
                ]
            }
        ]
        };
    },

    replaceTrack( stream, recipientPeer ) {
        let sender = recipientPeer.getSenders ? recipientPeer.getSenders().find( s => s.track && s.track.kind === stream.kind ) : false;

        sender ? sender.replaceTrack( stream ) : '';
    },

    toggleShareIcons( share ) {
        let shareIconElem = document.querySelector( '#share-screen' );

        if ( share ) {
            shareIconElem.setAttribute( 'title', 'Stop sharing screen' );
            shareIconElem.children[0].classList.add( 'text-primary' );
            shareIconElem.children[0].classList.remove( 'text-white' );
        }

        else {
            shareIconElem.setAttribute( 'title', 'Share screen' );
            shareIconElem.children[0].classList.add( 'text-white' );
            shareIconElem.children[0].classList.remove( 'text-primary' );
        }
    },


    toggleVideoBtnDisabled( disabled ) {
        document.getElementById( 'toggle-video' ).disabled = disabled;
    },


    maximiseStream( e ) {
        let elem = e.target.parentElement.previousElementSibling;

        elem.requestFullscreen() || elem.mozRequestFullScreen() || elem.webkitRequestFullscreen() || elem.msRequestFullscreen();
    },


    singleStreamToggleMute( e ) {
        if ( e.target.classList.contains( 'fa-microphone' ) ) {
            e.target.parentElement.previousElementSibling.muted = true;
            e.target.classList.add( 'fa-microphone-slash' );
            e.target.classList.remove( 'fa-microphone' );
        }
        else {
            e.target.parentElement.previousElementSibling.muted = false;
            e.target.classList.add( 'fa-microphone' );
            e.target.classList.remove( 'fa-microphone-slash' );
        }
    },

    toggleModal( id, show ) {
        let el = document.getElementById( id );

        if ( show ) {
            el.style.display = 'block';
            el.removeAttribute( 'aria-hidden' );
        }

        else {
            el.style.display = 'none';
            el.setAttribute( 'aria-hidden', true );
        }
    },


    setLocalStream( stream, mirrorMode = true ) {
        const localVidElem = document.getElementById( 'local' );

        localVidElem.srcObject = stream;
        mirrorMode ? localVidElem.classList.add( 'mirror-mode' ) : localVidElem.classList.remove( 'mirror-mode' );
    },


    adjustVideoElemSize() {
        let elem = document.getElementsByClassName( 'card' );
        let totalRemoteVideosDesktop = elem.length;
        let newWidth = totalRemoteVideosDesktop <= 2 ? '50%' : (
            totalRemoteVideosDesktop == 3 ? '33.33%' : (
                totalRemoteVideosDesktop <= 8 ? '25%' : (
                    totalRemoteVideosDesktop <= 15 ? '20%' : (
                        totalRemoteVideosDesktop <= 18 ? '16%' : (
                            totalRemoteVideosDesktop <= 23 ? '15%' : (
                                totalRemoteVideosDesktop <= 32 ? '12%' : '10%'
                            )
                        )
                    )
                )
            )
        );


        for ( let i = 0; i < totalRemoteVideosDesktop; i++ ) {
            elem[i].style.width = newWidth;
        }
    },

    async getMeetingInfoFromDB(enteredRoomName){
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
        const app = initializeApp(firebaseConfig);
        
        const db = getFirestore();
        var ref = doc(db, "meeting", enteredRoomName);
        const docSnap = await getDoc(ref);
        
        console.log("[DB] DocSnap: ", docSnap);
          var roomName;
          
        if(docSnap.exists()) {
            console.log("[DOCSNAP DATA ]", await docSnap.data());
            roomnamefromdb = docSnap.data().roomname;
            roompasswordfromdb = docSnap.data().roompassword;
            sessionStorage.setItem('roomnamefromdb', roomnamefromdb);
            sessionStorage.setItem('roompasswordfromdb', roompasswordfromdb);
            return docSnap.data();
        }
        else{
            roomnamefromdb = "";
            roompasswordfromdb = "";
            alert("Invalid Meeting Link");
        }
    },

    async isValidRoom(enteredRoomName){
        console.log("[GET ROOM] entered roomname : ", enteredRoomName)
        await this.getMeetingInfoFromDB(enteredRoomName);       
    },

    getRoomPassword(enteredRoomName){
        var roompassword = "";

        async function getMeetingFromDB(){
            ref = doc(db, "meeting", enteredRoomName);
            const docSnap = getDocFromDB(ref);
            if(docSnap.exists()) {
                roompassword = docSnap.data().roompassword;
            }
        }
        return roompassword;
    },

    getRoomNameFromDB(){
        return this.roomnamefromdb;
    },

    getRoomPasswordFromDB(){
        return this.roomnamefromdb;
    }

};
