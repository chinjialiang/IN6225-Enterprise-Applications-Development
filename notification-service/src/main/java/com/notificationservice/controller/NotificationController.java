package com.notificationservice.controller;

import com.notificationservice.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class NotificationController {

    NotificationService notificationService;


    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/send-notification")
    public ResponseEntity<Void> sendNotification() throws IOException {
        System.out.println("Executing sendNotification");

        notificationService.processTransactionAndSendNotification();

        return ResponseEntity.ok().build();
    }
}
