# Rabbitmq Firebase Service

# Kickstart the application
##### The entire application uses docker to run including node.js, rabbitmq and MySql database
```sh
$ docker-compose build
$ docker-compose up
```

# Environment Variable
##### Fill in "FIREBASE_TOKEN" in .env file. The rest of environment variable remains the same.

##### If the "FIREBASE_TOKEN" is not set up correctly, the http request to the firebase will not receive http status 200. 

##### Then the service will not trigger further action.
```sh
NODE_ENV=development
PORT=3001
FIREBASE_TOKEN=

RABBIT_MQ_HOST=rabbitmq
RABBIT_MQ_PORT=5672
RABBIT_MQ_USERNAME=guest
RABBIT_MQ_PASSWORD=guest

DB_NAME=FCM
DB_USERNAME=user
DB_PASSWORD=password
DB_HOST=db
DB_PORT=3306
```

# Trigger notification.fcm pulish action for testing

##### api: http://localhost:3001/notification/fcm
```sh
Method: Get
Response: {
    "success": true,
    "reason": "success"
}
```
##### Publish message

```sh
{ 
    "identifier": "fcm-msg-a1beff5ac", 
    "type": "device", 
    "deviceId": "string", 
    "text": "Notification message"
}

```


# Database
### MySql

# Run Database Migration
##### To simplify the migration process, the program will migrate to the database automatically 

# Access Database
##### port: 3306
##### username: root
##### password: password

# Access RabbitMq Dashboard
##### localhost:15672
##### username: guest
##### password: guest


# Troubleshoot
##### If you encounter any build error, please run the command below and rerun the command above
```sh
docker-compose down
```