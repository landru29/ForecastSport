#server-app

## Dependancies
Get the dependancies by launching those commands:

-  ```cd ./server-app```
-  ```npm install```

## Configuration
Make a copy of files (remove ```.sample``` in the new files):

-  ```./server-app/app/authentification.sample.json```
-  ```./server-app/seeds/seeds.sample.json```

And Modify thoses files.

## Seeds
Prepare database. Just launche those commands:

-  ```cd ./server-app/seeds```
-  ```node seed.js```

## Checking the code
Launch grunt:

-  ```cd ./server-app```
-  ```grunt```


## Launch the server
Before, you have to have a mongodb alive. To launch the server:

-  ```cd ./server-app```
-  ```npm start```

## REST client
You can launch a rest client for debugging:
-  ```cd ./server-app```
-  ```grunt rest```