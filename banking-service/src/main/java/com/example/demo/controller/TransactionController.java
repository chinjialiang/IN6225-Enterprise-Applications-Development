package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
public class TransactionController {

    TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("/transactions/{accountNumber}")
    public ResponseEntity<List<Transaction>> getTransactionsByAccountNumber(@PathVariable("accountNumber") String AccountNumber) {
        System.out.println("Executing getTransactionsByAccountNumber");

        List<Transaction> transactions = transactionService.retrieveTransactionsByAccountNumber(AccountNumber);

        return ResponseEntity.ok(transactions);
    }

    @PostMapping("/transfer-fund")
    public ResponseEntity<Transaction> transferFund(@RequestBody Transaction transactionBody) throws IOException {
        System.out.println("Executing transferFund");

        String fromAccount = transactionBody.getFromAccount();
        String toAccount = transactionBody.getToAccount();
        double amount = transactionBody.getAmount();

        Transaction transaction = transactionService.processTransaction(fromAccount, toAccount, amount);

        return ResponseEntity.ok(transaction);
    }
}
