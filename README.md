# Microsoft Teams Clone 
This is a **Microsoft teams clone** in which more than two people can connect in real-time.

# Live Demo
#### - `Wait for the Server's reply during Signing Up` 
#### - `Don't use Special Characters in User Name and Room Name`
#### `App Link:` https://pure-oasis-39392.herokuapp.com   
#### `Demo:` https://youtu.be/KgrrSdcZzBU 


## Development
### Running on localhost
1. In `public\javascripts\script.js` , **line no: 40** <br>
change `port: '443'`   **->**    `port: '3030'`

2. In the root directory <br>
  **Run** 
    ```
    npm install
    node server.js
    ```
    The app will run on `localhost:3030`


## TechStack
1. **FrontEnd:** `EJS, CSS and JavaScript` 
  
2. **BackEnd Server:** `NodeJS & Express.js`

3. **Video calling:** `PeerJs and Socket.IO` 
    - PeerJS wraps the browser's WebRTC implementation to provide a complete, configurable, and easy-to-use peer-to-peer connection API.

4. **Database:** `Firebase Firestore (For Data management and messaging)`


# Features
- **Responsive UI**
- **Authentication**
  - Create an account and then login
  - Auth check to prevent unauthorized users from entering
  - Users that have not joined the room/team, cannot join the team meeting using the link
  - Auto logout when tab or window gets closed
- **Create/Join Room(team)**
  - Create your own room/team
  - Join your friend's or colleague's room/team
  - Exit room/team
- **Chat feature**
  - Instant text messaging
  - Group Messaging
  - Notifications
- **Video conferencing**
  - One to one and group video calls
  - In Meet messaging
  - Mute/Unmute the Audio
  - Start/Stop the Video
  - Hand raise
  - `Informative video border` (Blue if the mic is on, Grey if the mic is off, and Golden if a user has raised his hand)
  - Participants list


# Preview
### `Sign Up`
![Signup](https://user-images.githubusercontent.com/73847812/125706490-39214ebf-d67b-46a9-9a09-7f4e788dd0ac.PNG)

### `Login`
![Login](https://user-images.githubusercontent.com/73847812/125706607-f0b53838-96b1-47ae-a31a-ffa1e5ab2f5a.PNG)

### `Chat`
![chat](https://user-images.githubusercontent.com/73847812/125707472-6758005a-8d3f-41ee-a874-d51cb8c062d9.PNG)

### `Meeting`
![Meeting](https://user-images.githubusercontent.com/73847812/125706697-2531cc2c-b898-4be5-9546-032de923ffa0.PNG)
