package com.notificationservice.messaging;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Properties;

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
