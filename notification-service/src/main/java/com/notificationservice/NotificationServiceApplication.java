package com.notificationservice;

import com.notificationservice.service.NotificationService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.IOException;

@EnableScheduling
@EnableCaching
@SpringBootApplication
public class NotificationServiceApplication {

    static NotificationService notificationService;

    public NotificationServiceApplication(NotificationService notificationService) {
        NotificationServiceApplication.notificationService = notificationService;
    }

    public static void main(String[] args) throws IOException {

        SpringApplication.run(NotificationServiceApplication.class, args);
        System.out.println("********* Application Started *********");

        notificationService.processTransactionAndSendNotification();

    }
}
