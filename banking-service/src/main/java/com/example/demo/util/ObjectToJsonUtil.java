package com.example.demo.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.io.IOException;

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
