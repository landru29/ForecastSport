#ForecastSport
Application to edit tournaments and let users to forecast

##Prerequisite
- Install NodeJs [https://nodejs.org/]
- Install MongoDb [https://www.mongodb.org/downloads]
- Install Bower ``` npm install -g bower ```
- Install Grunt ```npm install -g grunt-cli```

##server-app

### Dependancies
Get the dependancies by launching those commands:

-  ```cd ./server-app```
-  ```npm install```

### Configuration
Make a copy of files (remove ```.sample``` in the new files):

-  ```./server-app/app/authentification.sample.json```
-  ```./server-app/seeds/seeds.sample.json```

And Modify thoses files.

### Seeds
Prepare database. Just launche those commands:

-  ```cd ./server-app/seeds```
-  ```node seed.js```

### Checking the code
Launch grunt:

-  ```cd ./server-app```
-  ```grunt```


### Launch the server
Before, you have to have a mongodb alive. To launch the server:

-  ```cd ./server-app```
-  ```npm start```

### REST client
You can launch a rest client for debugging:
-  ```cd ./server-app```
-  ```grunt rest```

##client

### Dependancies
Get the dependancies by launching those commands:

-  ```cd ./client```
-  ```npm install```
-  ```bower install```

### debug the client
Launch *serve* task of grunt:

-  ```cd ./client```
-  ```grunt serve```

### Build the production
Launch grunt:

-  ```cd ./client```
-  ```grunt```