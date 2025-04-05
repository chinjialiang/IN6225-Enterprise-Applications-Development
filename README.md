# Banking App

This is a simple banking application consisting of 3 microservices.
- **banking-app**. Frontend react appplication.
- **banking-service**. Backend spring boot application.
- **notification-service**. Backend spring boot application.

### Prerequisites

- install node v22
- install java 17

## Initial setup

cd banking-app
```
npm install --legacy-peer-deps
```

Install MySQL server and start the server. Run the command on SQL workbench to create a new schema.
```
create schema bankingservice
```

Go to `application.properties` in banking-service and notification-service. Update the username and password.
```
spring.datasource.username=<username>
spring.datasource.password=<password>
```

Go to `client.properties` in banking-service and notification-service. Update the username and password.
```
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='<username>' password='<password>';
```

Go to https://support.google.com/accounts/answer/185833?hl=en. Create a app-password. <br/>
Go to `notification-service/src/main/java/com/notificationservice/service/NotificationService.java`. Update email and app-password.
```
Session session = Session.getInstance(props, new Authenticator(){
    protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(
                "<email>", "<app-password>");// https://support.google.com/accounts/answer/185833?hl=en
    }
});
```
Update recipient email in sendEmailNotification method.
```
String emailID = "<recipient-email>";
```

## Run the application

cd banking-app
```
npm start
```

On a new terminal. Start banking-service. <br/>
On a new terminal. Start notification-service.

## Frontend components

## Backend components
### Database migration using flyway
build.gradle
```
implementation 'org.flywaydb:flyway-mysql'
implementation 'org.flywaydb:flyway-core'
```
application.properties
```
spring.flyway.locations=classpath:db/migrations
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate = true
```
Newly created SQL scripts placed in `banking-service\src\main\resources\db\migrations` will automatically run when the application starts. The database will keep track of all schema change history. <br/>
![image](https://github.com/user-attachments/assets/921ac27b-7515-439a-9125-cfbc48b0ec8a)



