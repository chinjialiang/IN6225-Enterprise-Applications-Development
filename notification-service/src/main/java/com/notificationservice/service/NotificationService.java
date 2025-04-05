package com.notificationservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.notificationservice.messaging.KafkaConfig;
import com.notificationservice.messaging.KafkaConsumer;
import com.notificationservice.model.Transaction;
import com.notificationservice.util.EmailUtil;
import jakarta.mail.Authenticator;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Duration;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Map;
import java.util.Properties;

@Service
public class NotificationService {

    KafkaConsumer kafkaConsumer;
    KafkaConfig kafkaConfig;
    static ObjectMapper objectMapper;

    public NotificationService(KafkaConsumer kafkaConsumer, KafkaConfig kafkaConfig, ObjectMapper objectMapper) {
        this.kafkaConsumer = kafkaConsumer;
        this.kafkaConfig = kafkaConfig;
        this.objectMapper = objectMapper;
    }

    public void processTransactionAndSendNotification() throws IOException {
        System.out.println("Executing processTransaction");

        String topic = "topic_0";
        Properties config = KafkaConfig.readConfig("src/main/resources/client.properties");

        // sets the group ID, offset and message deserializers
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "java-group-1");
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        // creates a new consumer instance and subscribes to messages from the topic
        org.apache.kafka.clients.consumer.KafkaConsumer<String, String> consumer = new org.apache.kafka.clients.consumer.KafkaConsumer<>(config);
        consumer.subscribe(Arrays.asList(topic));

        while (true) {
            // polls the consumer for new messages and prints them
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
            for (ConsumerRecord<String, String> record : records) {
                System.out.println(
                        String.format(
                                "Consumed message from topic %s: key = %s value = %s", topic, record.key(), record.value()));

                sendEmailNotification(record.value());
            }
        }
    }


    public static void sendEmailNotification(String message) throws JsonProcessingException {

        Transaction transaction = objectMapper.readValue(message, Transaction.class);

        String smtpHostServer = "smtp.gmail.com";
        String emailID = "chinjialiang@live.com";

        Properties props = System.getProperties();
        props.put("mail.smtp.starttls.enable","true");
        props.put("mail.smtp.host", smtpHostServer);
        props.put("mail.smtp.auth", "true");

        Session session = Session.getInstance(props, new Authenticator(){
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(
                        "<email>", "<app-password>");// https://support.google.com/accounts/answer/185833?hl=en
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
}
