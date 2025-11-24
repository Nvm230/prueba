package com.univibe.notification.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    private final JavaMailSender mailSender;
    
    public MailService(JavaMailSender mailSender) { 
        this.mailSender = mailSender; 
    }

    @Async("applicationTaskExecutor")
    public void send(String to, String subject, String text) {
        sendHtmlEmail(to, subject, wrapInTemplate(subject, text));
    }

    @Async("applicationTaskExecutor")
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML
            helper.setFrom("noreply@univibe.com");
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo HTML", e);
        }
    }

    private String wrapInTemplate(String title, String content) {
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>%s</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); min-height: 100vh;">
                <table role="presentation" style="width: 100%%; border-collapse: collapse;">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <!-- Main Container -->
                            <table role="presentation" style="max-width: 600px; width: 100%%; background: white; border-radius: 24px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); overflow: hidden;">
                                <!-- Header with Gradient -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 40px 30px; text-align: center;">
                                        <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                            🎓 UniVibe
                                        </h1>
                                        <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">
                                            Tu comunidad universitaria
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">
                                            %s
                                        </h2>
                                        <div style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                                            %s
                                        </div>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background: linear-gradient(to right, #f7fafc, #edf2f7); padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                                        <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                                            © 2025 UniVibe - Conectando estudiantes
                                        </p>
                                        <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                                            Este es un correo automático, por favor no responder.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(title, title, content);
    }

    public String createEventRegistrationEmail(String eventTitle, String eventStartTime, String userName) {
        String content = """
            <p style="margin: 0 0 15px 0;">Hola <strong>%s</strong>,</p>
            <p style="margin: 0 0 15px 0;">¡Te has registrado exitosamente al evento!</p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); border-radius: 16px; padding: 25px; margin: 25px 0; color: white;">
                <h3 style="margin: 0 0 10px 0; font-size: 20px; font-weight: 600;">📅 %s</h3>
                <p style="margin: 0; font-size: 16px; opacity: 0.95;">
                    <strong>Fecha y hora:</strong> %s
                </p>
            </div>
            
            <p style="margin: 0 0 15px 0;">
                Te esperamos. ¡No olvides estar atento a las notificaciones!
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
                <p style="margin: 0; color: #718096; font-size: 14px;">
                    💡 <strong>Tip:</strong> Activa las notificaciones en la app para no perderte ningún detalle.
                </p>
            </div>
            """.formatted(userName, eventTitle, eventStartTime);
        
        return wrapInTemplate("Registro Confirmado", content);
    }

    public String createNotificationEmail(String title, String message, String userName) {
        String content = """
            <p style="margin: 0 0 15px 0;">Hola <strong>%s</strong>,</p>
            
            <div style="background: linear-gradient(to right, #f0f9ff, #e0f2fe); border-left: 4px solid #0ea5e9; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0; color: #0c4a6e; font-size: 16px; line-height: 1.6;">
                    %s
                </p>
            </div>
            
            <p style="margin: 20px 0 0 0; color: #718096; font-size: 14px;">
                Mantente conectado con tu comunidad universitaria 🎓
            </p>
            """.formatted(userName, message);
        
        return wrapInTemplate(title, content);
    }
}
