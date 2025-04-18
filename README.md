# Banking App

This is a simple banking application consisting of 3 microservices.
- **banking-app**. Frontend react appplication.
- **banking-service**. Backend spring boot application.
- **notification-service**. Backend spring boot application.

### Prerequisites

Install node v22
```
nvm install 22.0.0
nvm use 22.0.0
```
Verification
```
node -v
v22.0.0
```
Refer to https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/ on how to set up node version manager.

install java 17

<p align="center">
  <img src="https://github.com/user-attachments/assets/1b6ad28a-a97b-4687-af23-5e00a4b3355f" />
  <img src="https://github.com/user-attachments/assets/ff24fa65-a084-4a2e-9f2f-86acb47d18eb" />
  <img src="https://github.com/user-attachments/assets/ebb40461-13aa-428d-80ea-81cdd694f5ff" />
  <img src="https://github.com/user-attachments/assets/5bd1d5b5-acbb-4f5c-9d59-8441b4771390" />
  <img src="https://github.com/user-attachments/assets/3181ec78-c65e-44b3-829d-17eb25680699" />
</p> <br/>

## Initial setup

cd banking-app
```
npm install
```

Install MySQL server and start the server. Run the command on SQL workbench to create a new schema.
```
create schema bankingservice
```

Go to `application.properties` in banking-service and notification-service. Update the username and password. (Database)
```
spring.datasource.username=<username>
spring.datasource.password=<password>
```

Go to `client.properties` in banking-service and notification-service. Update the username and password.  (Kafka)
```
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='<username>' password='<password>';
```

Go to https://support.google.com/accounts/answer/185833?hl=en. Create a app-password. <br/>
Go to `notification-service/src/main/java/com/notificationservice/service/NotificationService.java`. Update email and app-password. (Google Account)
```
Session session = Session.getInstance(props, new Authenticator(){
    protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(
                "<your-email>", "<app-password>");// https://support.google.com/accounts/answer/185833?hl=en
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
On a new terminal. Start notification-service. <br/>
If you have java and gradle installed
```
./gradlew clean build
./gradlew bootrun
```
else locate NotificationServiceApplication / BankingServiceApplication and start the application

<p align="center">
  <img src="https://github.com/user-attachments/assets/8d2d6071-df01-4dc2-8d10-57d4066f36dc" />
</p> <br/>

## Architecture

<p align="center">
  <img src="https://github.com/user-attachments/assets/662feb7b-65a1-4c84-a73e-567a49b74c9b" />
</p> <br/>

## Frontend components
### Account Registration (POST /register)

<p align="center">
  <img src="https://github.com/user-attachments/assets/33937370-337c-454c-a814-315a8a194aad" />
</p> <br/>

### Account Login (POST /login)

<p align="center">
  <img src="https://github.com/user-attachments/assets/5748e8f4-d990-4513-928f-ceb97bc07eb7" />
</p> <br/>

### Account Details and Transactions (GET /transactions/{accountNumber})

<p align="center">
  <img src="https://github.com/user-attachments/assets/5926cb90-bba5-4c8f-8cbd-f1f23461ee34" />
</p> <br/>

### Fund Transfer (POST /transfer-fund)

<p align="center">
  <img src="https://github.com/user-attachments/assets/015cfaa9-218c-457d-a0e4-a8d8a3040d82" />
</p> <br/>

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

<p align="center">
  <img src="https://github.com/user-attachments/assets/7dd68bbe-3543-4988-ad01-ef636d95b864" />
</p> <br/>

<p align="center">
  <img src="https://github.com/user-attachments/assets/5be1b48c-ea95-4829-9075-f22d372d7ef3" />
</p> <br/>

### Event driven capabilities using kafka
build.gradle
```
implementation 'org.apache.kafka:kafka-clients:3.3.1'
```
client.properties
```
bootstrap.servers=pkc-312o0.ap-southeast-1.aws.confluent.cloud:9092
security.protocol=SASL_SSL
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required username='ZNJD2NENVM5LUOC7' password='Dnx9On1ziBWsRLW/BaazoG4epL4GFEKSV+Bd9FX2PaJvdsoI9ugrluquNJjTZD5i';
sasl.mechanism=PLAIN
client.dns.lookup=use_all_dns_ips
session.timeout.ms=45000
acks=all
client.id=ccloud-java-client-a714104c-3ce0-4cca-a4cd-7d43b0444be1
```
KafkaConfig
```
package com.notificationservice.messaging;

import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;

@Component
public class KafkaConfig {

    public static Properties readConfig(final String configFile) throws IOException {
        // reads the client configuration from client.properties
        // and returns it as a Properties object
        if (!Files.exists(Paths.get(configFile))) {
            throw new IOException(configFile + " not found.");
        }

        final Properties config = new Properties();
        try (InputStream inputStream = new FileInputStream(configFile)) {
            config.load(inputStream);
        }

        return config;
    }
}
```
KafkaProducer
```
@Component
public class KafkaProducer {

    public static void produce(String topic, String key, String value) throws IOException {
        final Properties config = readConfig("src/main/resources/client.properties");
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        org.apache.kafka.clients.producer.Producer<String, String> producer = new org.apache.kafka.clients.producer.KafkaProducer<>(config);
        producer.send(new ProducerRecord<>(topic, key, value));
        System.out.println(
                String.format(
                        "Produced message to topic %s: key = %s value = %s", topic, key, value));

        producer.close();
    }

    public static Properties readConfig(final String configFile) throws IOException {
        if (!Files.exists(Paths.get(configFile))) {
            throw new IOException(configFile + " not found.");
        }

        final Properties config = new Properties();
        try (InputStream inputStream = new FileInputStream(configFile)) {
            config.load(inputStream);
        }

        return config;
    }
}
```
KafkaConsumer
```
@Component
public class KafkaConsumer {

    public static void consume(String topic, Properties config) {
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "java-group-1");
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        org.apache.kafka.clients.consumer.KafkaConsumer<String, String> consumer = new org.apache.kafka.clients.consumer.KafkaConsumer<>(config);
        consumer.subscribe(Arrays.asList(topic));

        while (true) {
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
            for (ConsumerRecord<String, String> record : records) {
                System.out.println(
                        String.format(
                                "Consumed message from topic %s: key = %s value = %s", topic, record.key(), record.value()));
            }
        }
    }
}
```
Refer to https://developer.confluent.io/get-started/java/#introduction on how to setup kafka. <br/>

<br/>

### Object Mapper Using Jackson
build.gradle
```
implementation 'com.fasterxml.jackson.core:jackson-databind'
implementation 'com.fasterxml.jackson.dataformat:jackson-dataformat-csv:2.13.3'
implementation 'com.fasterxml.jackson.datatype:jackson-datatype-jsr310'
```
JacksonConfiguration
```
@Configuration
public class JacksonConfiguration {

    @Bean
    ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }
}
```
ObjectToJsonUtil
```
@Component
public class ObjectToJsonUtil {

    ObjectMapper objectMapper;

    public ObjectToJsonUtil(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public String convertObjectToJsonString (Object object) {
        try {
            String jsonStr = objectMapper.writeValueAsString(object);
            System.out.println(jsonStr);
            return jsonStr;
        }

        // Catch block to handle exceptions
        catch (IOException e) {
            e.printStackTrace();
        }

        return "";
    }
}
```

<br/>

### Sending Email Notifications Using jakarta.mail
EmailUtil
```
package com.notificationservice.util;

import jakarta.mail.Message;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.util.Date;

public class EmailUtil {

    public static void sendEmail(Session session, String toEmail, String subject, String body){
        try {
            MimeMessage msg = new MimeMessage(session);

            msg.addHeader("Content-type", "text/HTML; charset=UTF-8");
            msg.addHeader("format", "flowed");
            msg.addHeader("Content-Transfer-Encoding", "8bit");
            msg.setFrom(new InternetAddress("no_reply@example.com", "NoReply-JD"));
            msg.setReplyTo(InternetAddress.parse("no_reply@example.com", false));
            msg.setSubject(subject, "UTF-8");
            msg.setText(body, "UTF-8");
            msg.setSentDate(new Date());
            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail, false));

            Transport.send(msg);

            System.out.println("Email Sent Successfully!!");
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
sendEmailNotification method
```
public static void sendEmailNotification(String message) throws JsonProcessingException {

    Transaction transaction = objectMapper.readValue(message, Transaction.class);

    String smtpHostServer = "smtp.gmail.com";
    String emailID = "<recipient-email>";

    Properties props = System.getProperties();
    props.put("mail.smtp.starttls.enable","true");
    props.put("mail.smtp.host", smtpHostServer);
    props.put("mail.smtp.auth", "true");

    Session session = Session.getInstance(props, new Authenticator(){
        protected PasswordAuthentication getPasswordAuthentication() {
            return new PasswordAuthentication(
                    "<your-email>", "<app-password>");// https://support.google.com/accounts/answer/185833?hl=en
        }
    });

    EmailUtil.sendEmail(session, emailID,"iBanking Alerts",
            "Dear Customer, " + '\n' + '\n' +
                    "We are pleased to confirm that the transaction was completed."  + '\n' + '\n' +
                    "Transaction ID: " + transaction.getTransactionId() + '\n' +
                    "From Account: " + transaction.getFromAccount() + '\n' +
                    "To Account: " + transaction.getToAccount() + '\n' +
                    "Amount: " + transaction.getAmount() + '\n' +
                    "Datetime: " + transaction.getDateTime().plus(8, ChronoUnit.HOURS) + '\n' + '\n' +
                    "Thank you for banking with us." + '\n' + '\n' +
                    "Yours faithfully" + '\n' +
                    "DBS Bank Ltd"
    );
}
```

## Future Improvements
### Using NGINX as reverse proxy
A reverse proxy listens on the default ports and forwards incoming requests to the appropriate backend port behind the scenes. This way users do not have to remember the port number.
```
server {
    listen 80;
    server_name mydomain.com;

    location /api/ {
        proxy_pass http://localhost:3000/;  # your service
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

```
Now if a user visits:
```
http://mydomain.com/api/users
```
NGINX internally sends that to:
```
http://localhost:3000/api/users
```

### Application Monitoring
Micrometer provides a simple facade over the instrumentation clients for a number of popular monitoring systems. Currently, it supports the following monitoring systems: Atlas, Datadog, Graphite, Ganglia, Influx, JMX, and Prometheus. 
Read more: https://www.baeldung.com/micrometer
