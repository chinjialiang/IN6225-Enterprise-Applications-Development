package com.notificationservice.util;


import com.notificationservice.exception.ValidationException;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

@Component
public class CsvUtil {

    private final CsvMapper csvMapper;

    public CsvUtil(CsvMapper csvMapper) {
        this.csvMapper = csvMapper;
    }

    public <T> String buildCsv(List<T> object, String header) {

        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(header);

        object.forEach(item -> {
            StringBuilder temp = new StringBuilder();
            Field[] fields = item.getClass().getDeclaredFields();
            try {
                for (Field f : fields) {
                    f.setAccessible(true);
                    Object v = f.get(item);
                    temp.append(v).append(",");
                }

                temp.setLength(temp.length() - 1);
                temp.append("\n");
                stringBuilder.append(temp);
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        });

        return stringBuilder.toString();
    }

    public Map<String, String> readCsvContent(String content) {
        try {
            CsvSchema csvSchema = CsvSchema.builder()
                    .setUseHeader(false)
                    .addColumn("product_id")
                    .addColumn("product_name")
                    .addColumn("product_description")
                    .addColumn("price")
                    .addColumn("quantity")
                    .addColumn("category")
                    .build()
                    .withoutHeader();

            return csvMapper.readerForMapOf(String.class).with(csvSchema).readValue(content);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void validateFileExtension(Resource productFile, String header) {
        String fileName = productFile.getFilename();

        if (fileName == null || fileName.indexOf(".") == 0 || !fileName.substring(fileName.indexOf(".") + 1).equals("csv")) {
            throw new ValidationException("Only csv filetype allowed");
        }
    }

    public void validateHeaders(Resource productFile, String headers) {
        try {
            Scanner scanner = new Scanner(productFile.getInputStream());
            String fileHeader = scanner.nextLine();

            if (!fileHeader.equals(headers)) {
                throw new ValidationException("Incorrect Headers");
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
