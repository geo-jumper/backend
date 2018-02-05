```

 ██████╗ ███████╗ ██████╗          ██╗██╗   ██╗███╗   ███╗██████╗ ███████╗██████╗ 
██╔════╝ ██╔════╝██╔═══██╗         ██║██║   ██║████╗ ████║██╔══██╗██╔════╝██╔══██╗
██║  ███╗█████╗  ██║   ██║         ██║██║   ██║██╔████╔██║██████╔╝█████╗  ██████╔╝
██║   ██║██╔══╝  ██║   ██║    ██   ██║██║   ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██╔══██╗
╚██████╔╝███████╗╚██████╔╝    ╚█████╔╝╚██████╔╝██║ ╚═╝ ██║██║     ███████╗██║  ██║
 ╚═════╝ ╚══════╝ ╚═════╝      ╚════╝  ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝
                                                                                  
```

# Backend Application


#### `Master` : [![Build Status](https://travis-ci.org/geo-jumper/backend.svg?branch=master)](https://travis-ci.org/geo-jumper/backend)

# Code Fellows: Seattle 401 JavaScript - 401d19 


## Authors:
* Cameron Moorehead: https://github.com/CameronMoorehead
* Catherine Looper: https://github.com/ccloops
* Dalton Carr: https://github.com/hazzed
* Matt LeBlanc: https://github.com/Snobeard
* Jeff Kusowski: https://github.com/jjkusowski

### Motivation

Geo-Jumper is a multiplayer fullstack platform game that combines socket.io with a frontend React library.

---

### How to use?
#### To use the Geo-Jumper Game Application:

* You can either create an account or play anonymously.

---
### Developer Tools:

* Step 1. Fork and Clone the Repository.
* Step 2. `npm install`.
* Step 3. touch a .env file and add the following environment variables:
```  
  PORT=3000
  NODE_ENV=production
  CORS_ORIGINS='http://localhost:8080'
  MONGODB_URI='mongodb://localhost/testing'
  SECRET='yourSecretKey'
``` 
* Step 4. start MongoDB by calling `npm run dbon`.
* Step 5. to test the API, open a second terminal window and run the command `npm run test`.
* Step 6. If you would like to start the server, you can run the command `npm run start`.

### If you would like to contribute:

* PR: If you would like to contribute to the Repo, please open a Pull Request and we will review it
* Bug Reporting: If you find a bug - please report it by opening up an issue in this git repository.

### License

MIT © Geo-Jumper