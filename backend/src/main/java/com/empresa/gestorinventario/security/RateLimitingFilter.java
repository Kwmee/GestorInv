// security/RateLimitingFilter.java
package com.empresa.gestorinventario.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitingFilter implements Filter {

    private static final int MAX_ATTEMPTS = 10;
    private static final long WINDOW_MS = 60_000;

    private final Map<String, AtomicInteger> counts = new ConcurrentHashMap<>();
    private final Map<String, Long> windowStart = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        if (request.getRequestURI().endsWith("/auth/login")
                && "POST".equalsIgnoreCase(request.getMethod())) {
            String ip = getClientIp(request);
            long now = System.currentTimeMillis();

            windowStart.putIfAbsent(ip, now);
            counts.putIfAbsent(ip, new AtomicInteger(0));

            if (now - windowStart.get(ip) > WINDOW_MS) {
                windowStart.put(ip, now);
                counts.get(ip).set(0);
            }

            if (counts.get(ip).incrementAndGet() > MAX_ATTEMPTS) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"mensaje\":\"Demasiados intentos. Espera 1 minuto.\"}");
                return;
            }
        }
        chain.doFilter(req, res);
    }

    private String getClientIp(HttpServletRequest request) {
        String realIp = request.getHeader("X-Real-IP");
        if (realIp != null && !realIp.isBlank()) return realIp.trim();
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            String[] parts = forwarded.split(",");
            return parts[parts.length - 1].trim(); // último = más cercano al servidor
        }
        return request.getRemoteAddr();
    }
}
