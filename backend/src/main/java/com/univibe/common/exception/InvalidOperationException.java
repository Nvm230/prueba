package com.univibe.common.exception;

public class InvalidOperationException extends ApiException {
    public InvalidOperationException(String message) {
        super(message, 422);
    }
}
