# Banking App

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

Go to application.properties in banking-service and notification-service. Update the username and password.
```
spring.datasource.username=<username>
spring.datasource.password=<password>
```

Go to client.properties in banking-service and notification-service. Update the username and password.
```
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='<username>' password='<password>';
```

Go to https://support.google.com/accounts/answer/185833?hl=en. Create a app-password. <br/>
Go to notification-service/src/main/java/com/notificationservice/service/NotificationService.java. Update email and app-password.
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
