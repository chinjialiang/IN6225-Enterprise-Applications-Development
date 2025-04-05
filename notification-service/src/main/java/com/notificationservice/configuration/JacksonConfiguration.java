package com.notificationservice.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvParser;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfiguration {

    @Bean
    CsvMapper csvMapper() {
        return new CsvMapper()
                .enable(CsvParser.Feature.TRIM_SPACES)
                .enable(CsvParser.Feature.SKIP_EMPTY_LINES)
                .enable(CsvParser.Feature.IGNORE_TRAILING_UNMAPPABLE);
    }

    @Bean
    ObjectMapper objectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        return objectMapper;
    }
}
