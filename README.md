#Word Challenges 

##Word Challenges is an interactive word-guessing game for everyone!

###To enjoy the latest hosted version, please use [this link](https://word-challenges.herokuapp.com/).

###For local development, Please refer to the following steps:
1. Clone this repo into your local machine.

2. Comment out & uncomment the following:
    - In `server/server.js`:
        - Uncomment the localhost CORS origin in `server.js`, inside the `io` variable definition.
        - Comment out the Heroku local origin in the same file. This should be located directly above or below the localhost CORS origin.
    - In `client/src/SocketProvider/index.js`:
        - Uncomment the connection variable for `'http://localhost:8080'`.
        - Comment out the Heroku connection variable. This should be located directly above or below the above variable.

3. In the project's **root** directory, run the following commands to start the server:
    - npm i
    - npm run dev

4. In the **client** folder:
    - Add `"proxy": "http://localhost:8080/"` to `package.json` in **client** (NOTE: this is **NOT** the `package.json` in the **root** directory)
    - Run the following commands inside **client**:
        - npm i
        - npm start

5. If the application was **NOT** automatically launched after *step 4*, open your web browser and navigate to `localhost:3000`.