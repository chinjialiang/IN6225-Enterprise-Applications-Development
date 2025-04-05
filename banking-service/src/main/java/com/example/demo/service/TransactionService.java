package com.example.demo.service;

import com.example.demo.exception.ValidationException;
import com.example.demo.messaging.KafkaProducer;
import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.ObjectToJsonUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.Instant;
import java.util.*;

@Service
public class TransactionService {

    UserRepository userRepository;
    TransactionRepository transactionRepository;
    KafkaProducer kafkaProducer;
    ObjectToJsonUtil objectToJsonUtil;

    public TransactionService(UserRepository userRepository, TransactionRepository transactionRepository, KafkaProducer kafkaProducer, ObjectToJsonUtil objectToJsonUtil) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.kafkaProducer = kafkaProducer;
        this.objectToJsonUtil = objectToJsonUtil;
    }

    public List<Transaction> retrieveTransactionsByAccountNumber(String accountNumber) {
        System.out.println("Executing retrieveTransactionsByAccountNumber");

        List<Transaction> transactions = new ArrayList<>();

        List<Transaction> debitTransactions = transactionRepository.findAllByFromAccount(accountNumber);
        List<Transaction> creditTransactions = transactionRepository.findAllByToAccount(accountNumber);

        transactions.addAll(debitTransactions);
        transactions.addAll(creditTransactions);

        return transactions.stream()
                .sorted(Comparator.comparing(Transaction::getDateTime).reversed())
                .toList();
    }

    @Transactional
    public Transaction processTransaction(String fromAccount, String toAccount, double amount) throws IOException {
        System.out.println("Executing processTransaction");

        User fromAccountUser = userRepository.findByAccountNumber(fromAccount);
        User toAccountUser = userRepository.findByAccountNumber(toAccount);

        if (fromAccountUser == null || toAccountUser == null || fromAccountUser == toAccountUser) {
            throw new ValidationException("Invalid Recipient's Account Number");
        }

        if (fromAccountUser.getAccountBalance() < amount) {
            throw new ValidationException("Insufficient Funds");
        }

        fromAccountUser.setAccountBalance(fromAccountUser.getAccountBalance() - amount);
        toAccountUser.setAccountBalance(toAccountUser.getAccountBalance() + amount);

        userRepository.saveAll(List.of(fromAccountUser, toAccountUser));

        Transaction transaction = new Transaction(UUID.randomUUID().toString(), fromAccount, toAccount, amount, Instant.now());

        String objString = objectToJsonUtil.convertObjectToJsonString(transaction);
        KafkaProducer.produce("topic_0", transaction.getTransactionId(), objString);

        return transactionRepository.save(transaction);
    }
}
