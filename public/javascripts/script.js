const socket = io('/');  
const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');
let handValue = false;
let mikeValue = true;
myVideo.muted = true;

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let currentUserName;

let myVideoStream;
var peer;

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        currentUserName = user.displayName;

        db.collection('users').doc(user.uid).get().then((doc) => {
            var groupList = doc.data().groups;
            var trueRoomUser = false;

            for(var i=0; i < groupList.length; i++) {
                if(groupList[i]==ROOM_ID) {
                    trueRoomUser = true;
                    break;
                }     
            }

            if(!trueRoomUser) {
                alert("Please Join The Room First");
                location.href = '/home';
            }
        })

        peer = new Peer(currentUserName, {
            path: '/peerjs',
            host: '/',
            port: '443' // 443 for deploying
        });

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            myVideoStream = stream;
            myVideo.setAttribute('id', `${currentUserName}`);
            myVideo.setAttribute('class', 'border-blue');
            createVideoDiv(currentUserName);
            addVideoStream(myVideo, stream, currentUserName);
        
            peer.on('call', call => {
                createVideoDiv(call.peer);
                call.answer(stream);
                
                const video = document.createElement('video')
            
                call.on('stream', userVideoStream => {  
                    video.setAttribute('id', `${call.peer}`);
                    socket.emit('videoBorder', call.metadata.hvalue, call.metadata.mvalue, call.peer);
                    addVideoStream(video, userVideoStream, call.peer);
                })
            })
        
            socket.on('user-connected', (userId) => {
                setTimeout(connectToNewUser,1000,userId,stream)
            })
        
            socket.on('user-disconnected', (userId) => {
                var divId = userId + "-div"
                const videoElement = document.getElementById(`${divId}`);
                if(videoElement)
                    videoElement.remove();

                var docRef = db.collection("rooms").doc(ROOM_ID);
                docRef.update({
                    participants: firebase.firestore.FieldValue.arrayRemove(userId)
                });
            })
        }, (error) => {
            alert("Camera and Microphone Permission are Required for a Video Conversation.")
        });
        
        peer.on('open', id => {
            socket.emit('join-room', ROOM_ID, id);
            var docRef = db.collection("rooms").doc(ROOM_ID);
            docRef.update({
                participants: firebase.firestore.FieldValue.arrayUnion(currentUserName)
            });
        })

    } else { 
         alert("Please Login First!");  
        location.href = '/';
    }
});

const connectToNewUser = (userId, stream) => {
    option = {metadata: {"mvalue": stream.getAudioTracks()[0].enabled, "hvalue": handValue}};
    const call = peer.call(userId, stream, option);
    var video = document.createElement('video');
    createVideoDiv(userId);
    
    call.on('stream', userVideoStream => {
        video.setAttribute('id', `${call.peer}`);
        video.setAttribute('class', 'border-blue');
        addVideoStream(video, userVideoStream,call.peer)
    })
}

const addVideoStream = (video, stream, userName) => {
    var divId = userName + "-div"    
    video.srcObject = stream;

    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    document.getElementById(`${divId}`).append(video);
}

const createVideoDiv = (userName) => {
    var divId = userName + "-div"

    var html = `
    <div class="video-class" id=${divId}>
        <div class="video-name" >${userName}</div>
    </div>`
    videoGrid.insertAdjacentHTML('beforeend', html);
}


// Mute Function
const muteUnmute = () => {
    let track  = myVideoStream.getAudioTracks()[0].enabled;
    if (track) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        mikeValue = false;
        socket.emit('videoBorder', handValue, mikeValue, currentUserName);
        const html = ` <i class="unmute fas fa-microphone-slash"></i> `
        document.querySelector('.mute-button').innerHTML = html;
    } else {
        const html = ` <i class="fas fa-microphone"></i> `
        document.querySelector('.mute-button').innerHTML = html;
        myVideoStream.getAudioTracks()[0].enabled = true;
        mikeValue = true;
        socket.emit('videoBorder', handValue, mikeValue, currentUserName);
    }
}


const playStop = () => {
    let track  = myVideoStream.getVideoTracks()[0].enabled;
    if (track ) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        const html = ` <i class="stop fas fa-video-slash"></i> `
        document.querySelector('.video-button').innerHTML = html;
    } else {
        const html = ` <i class="fas fa-video"></i> `
        document.querySelector('.video-button').innerHTML = html;
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

socket.on('setVideoBorder', (hvalue, mvalue, UId) => {
    let uidElement = document.getElementById(`${UId}`);
    if(uidElement) {
        if(hvalue)
            uidElement.setAttribute('class', 'border-gold');
        else if(mvalue)
            uidElement.setAttribute('class', 'border-blue');
        else
            uidElement.setAttribute('class', 'border-grey');
    }
})

const hand = () => {
    if (handValue) {
        handValue = false;
        document.getElementById('hand-up').setAttribute('id', 'hand-down');
        socket.emit('videoBorder', handValue, mikeValue, currentUserName);
    } else {
        handValue = true;
        document.getElementById('hand-down').setAttribute('id', 'hand-up');
        socket.emit('videoBorder', handValue, mikeValue, currentUserName);
    }
}

function inviteOhters() {
    prompt( "Ask Your Friend To Join The Group First", ROOM_ID );
};


var docData; 
var lastDocument;

function scrollToBottom() {
    console.log("SCROOL TO B FUNXTION ")
    var totalHeight = document.querySelector('#list-top .simplebar-content-wrapper').scrollHeight;
    document.querySelector('#list-top .simplebar-content-wrapper').scrollTo({ top: totalHeight, behavior: "smooth" }); 
}

let textMessage = $('#chat-message')
$('html').keydown((e) => {
    if(e.which == 13 && textMessage.val().length !== 0) {
        sendMessage();
    }
})

function sendMessage() {
    if(textMessage.val().length !== 0) {
        var dateTime = getDateTime();
        db.collection('rooms').doc(ROOM_ID).collection('messages')
        .add({
            sender: currentUserName,
            time: dateTime,
            message: textMessage.val(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        $('.messages').append(`<li class="me-message">
                                    <div class="sender-details">
                                        <span>Me  </span><span>${dateTime}</span>
                                    </div>${textMessage.val()}</li>`);
        scrollToBottom();
        textMessage.val('');
    }
}

function realTimeMessage() {
    var firstTime = true;
    db.collection("rooms").doc(ROOM_ID).collection("messages").orderBy('createdAt','desc').limit(1)
    .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data().sender != currentUserName && !firstTime)
            {
                if(doc.data().sender == "admin")    
                    $('.messages').append(`<li class="admin-message"><span>${doc.data().message}</span></li>`);
                else
                    $('.messages').append(`<li class="other-message"><div class="sender-details"><span>${doc.data().sender} </span>
                                            <span> ${doc.data().time}</span></div>${doc.data().message}</li>`);
            }   
            firstTime = false;
        });
    });
    document.querySelector('#chat-heading').innerHTML = `${ROOM_ID}`;
}
realTimeMessage();

async function recentMessages(){
    const ref = await db.collection("rooms").doc(ROOM_ID).collection("messages").orderBy("createdAt", "desc").limit(20);
    docData = await ref.get();
    lastDocument = docData.docs[docData.docs.length-1];
    for(var i = 0; i < docData.docs.length; i++){
        
        if(currentUserName == docData.docs[i].data().sender)
            $('.messages').prepend(`<li class="me-message"><div class="sender-details"><span>Me  </span>
                    <span>${docData.docs[i].data().time}</span></div>${docData.docs[i].data().message}</li>`);

        else if(docData.docs[i].data().sender == "admin")    
            $('.messages').prepend(`<li class="admin-message"><span>${docData.docs[i].data().message}</span></li>`);

        else
        $('.messages').prepend(`<li class="other-message"><div class="sender-details"><span>${docData.docs[i].data().sender} </span>
                                <span> ${docData.docs[i].data().time}</span></div>${docData.docs[i].data().message}</li>`);

    }
    scrollToBottom();
}

recentMessages();

async function previousMessages(){
    const ref = await db.collection("rooms").doc(ROOM_ID).collection("messages")
                        .orderBy("createdAt", "desc").startAfter(lastDocument).limit(20);
    docData = await ref.get();

    if(!docData.docs.length) {
        return ;
    }

    lastDocument = docData.docs[docData.docs.length-1];
    for(var i=0; i<docData.docs.length; i++){

        if(currentUserName == docData.docs[i].data().sender)
            $('.messages').prepend(`<li class="me-message"><div class="sender-details"><span>Me  </span>
                        <span>${docData.docs[i].data().time}</span></div>${docData.docs[i].data().message}</li>`);

        else if(docData.docs[i].data().sender == "admin")    
            $('.messages').prepend(`<li class="admin-message"><span>${docData.docs[i].data().message}</span></li>`);

        else
        $('.messages').prepend(`<li class="other-message"><div class="sender-details"><span>${docData.docs[i].data().sender} </span>
                        <span> ${docData.docs[i].data().time}</span></div>${docData.docs[i].data().message}</li>`);
    }
}

$('#list-top .simplebar-content-wrapper').scroll(function() {
    var container = document.querySelector('#list-top .simplebar-content-wrapper'); 
    if(container.scrollTop == 0) {
        previousMessages();  
        container.scrollTo({ top: 10, behavior: "smooth" });
    }
 });

async function leaveMeeting() {
    if (confirm('Are You Sure You Want To Leave This Meeting?')) {
        var dateTime = getDateTime();
        var adminMessage = currentUserName + " left the meeting @" + dateTime; 
        await db.collection('rooms').doc(ROOM_ID).collection('messages')
        .add({
            sender: "admin",
            time: dateTime,
            message: adminMessage,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

        var userDocRef = await db.collection('rooms').doc(ROOM_ID).get();
        var participantList = userDocRef.data().participants;
        
        if(participantList.length == 1) {
            await db.collection("rooms").doc(ROOM_ID).update({
                    participants: firebase.firestore.FieldValue.arrayRemove(currentUserName)
            });
        }
        window.location.href = '/home';
      } 
}

function getDateTime(){
    var today = new Date();
    var date = today.getDate()+'/' + months[today.getMonth()]+'/'+today.getFullYear();
    var hour = today.getHours();
    var minutes =  today.getMinutes();
    if(hour < 9)
        hour = '0' + hour;
    if(minutes < 9)
        minutes = '0' + minutes;
    var DateTime = hour + ':' + minutes + '  ' + date;
    return DateTime;
}

function readParticipantsList() {
    db.collection("rooms").doc(ROOM_ID).onSnapshot((doc) => {
        if (doc.exists) {
            var participantList = doc.data().participants;
            document.querySelector('.participants-list').innerHTML = "";
            document.querySelector('#participants-count').innerHTML = `# ${participantList.length}`;

            for(var i=0; i<participantList.length; i++) {
                const html =`<li class="participant"><span>${participantList[i]}</span></li>`
                document.querySelector('.participants-list').insertAdjacentHTML('beforeend', html);
            }
        }
    });
}

readParticipantsList();