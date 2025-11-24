package com.univibe.call.config;

import com.univibe.call.web.CallSignalingHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class CallWebSocketConfig implements WebSocketConfigurer {

    private final CallSignalingHandler signalingHandler;

    public CallWebSocketConfig(CallSignalingHandler signalingHandler) {
        this.signalingHandler = signalingHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(signalingHandler, "/call-signal")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // Usar SockJS para compatibilidad
    }
}

