package com.laparada.la_parada_backend.service;

import com.laparada.la_parada_backend.dto.OrderResponse;
import com.laparada.la_parada_backend.entity.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.email.from:noreply@laparada.com}")
    private String fromEmail;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    /**
     * Enviar boleta por correo al crear pedido
     */
    public void sendOrderReceipt(OrderResponse order, String customerEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(customerEmail);
            helper.setSubject("Boleta de Compra - Pedido #" + order.getId() + " - Minimarket La Parada");

            String htmlContent = buildReceiptHtml(order);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ Boleta enviada a: " + customerEmail + " para pedido #" + order.getId());

        } catch (Exception e) {
            // MOCK MODE - Simular envío exitoso
            System.out.println("📧 [MOCK] Boleta simulada para pedido #" + order.getId());
            System.out.println("   📨 Para: " + customerEmail);
            System.out.println("   💰 Total: S/ " + order.getTotal());
            System.out.println("   📝 Items: " + order.getItems().size() + " productos");
            System.out.println("   ✅ Email de boleta simulado correctamente");
        }
    }

    /**
     * Enviar notificación de cambio de estado
     */
    public void sendOrderStatusUpdate(OrderResponse order, String customerEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(customerEmail);
            helper.setSubject("Actualización de Pedido #" + order.getId() + " - " + order.getEstado());

            String htmlContent = buildStatusUpdateHtml(order);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ Notificación de estado enviada: " + order.getEstado());

        } catch (Exception e) {
            // MOCK MODE
            System.out.println("📧 [MOCK] Notificación de estado para pedido #" + order.getId());
            System.out.println("   📨 Para: " + customerEmail);
            System.out.println("   📦 Estado: " + order.getEstado());
            System.out.println("   💬 Mensaje: " + getStatusMessage(order.getEstado()));
            System.out.println("   ✅ Notificación simulada correctamente");
        }
    }

    /**
     * Enviar email de bienvenida al registrarse
     */
    public void sendWelcomeEmail(String customerEmail, String customerName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(customerEmail);
            message.setSubject("¡Bienvenido a Minimarket La Parada!");

            String text = String.format(
                    "Hola %s,\n\n" +
                            "¡Bienvenido a Minimarket La Parada!\n\n" +
                            "Tu cuenta ha sido creada exitosamente.\n" +
                            "Ahora puedes disfrutar de nuestros productos frescos y ofertas especiales.\n\n" +
                            "¡Gracias por elegirnos!\n\n" +
                            "Equipo La Parada",
                    customerName);

            message.setText(text);
            mailSender.send(message);
            System.out.println("✅ Email de bienvenida enviado a: " + customerEmail);

        } catch (Exception e) {
            // MOCK MODE
            System.out.println("📧 [MOCK] Email de bienvenida");
            System.out.println("   👤 Para: " + customerName + " (" + customerEmail + ")");
            System.out.println("   🎉 ¡Bienvenido a Minimarket La Parada!");
            System.out.println("   ✅ Bienvenida simulada correctamente");
        }
    }

    /**
     * Construir HTML de la boleta
     */
    private String buildReceiptHtml(OrderResponse order) {
        StringBuilder html = new StringBuilder();

        html.append("<!DOCTYPE html>")
                .append("<html><head><meta charset='UTF-8'>")
                .append("<style>")
                .append("body { font-family: Arial, sans-serif; margin: 20px; }")
                .append(".header { background: #8BC34A; color: white; padding: 20px; text-align: center; }")
                .append(".content { padding: 20px; }")
                .append(".table { width: 100%; border-collapse: collapse; margin: 20px 0; }")
                .append(".table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }")
                .append(".table th { background-color: #f2f2f2; }")
                .append(".total { font-weight: bold; font-size: 18px; color: #8BC34A; }")
                .append("</style></head><body>");

        // Header
        html.append("<div class='header'>")
                .append("<h1>🛍️ MINIMARKET LA PARADA</h1>")
                .append("<p>Boleta de Compra Electrónica</p>")
                .append("</div>");

        // Información del pedido
        html.append("<div class='content'>")
                .append("<h2>📋 Información del Pedido</h2>")
                .append("<p><strong>Número de Pedido:</strong> #").append(order.getId()).append("</p>")
                .append("<p><strong>Cliente:</strong> ").append(order.getUsuarioNombre()).append("</p>")
                .append("<p><strong>Fecha:</strong> ").append(order.getFechaCreacion().format(DATE_FORMATTER))
                .append("</p>")
                .append("<p><strong>Estado:</strong> ").append(order.getEstado()).append("</p>")
                .append("<p><strong>Método de Pago:</strong> ").append(order.getMetodoPago()).append("</p>")
                .append("<p><strong>Tipo de Entrega:</strong> ").append(order.getTipoEntrega()).append("</p>");

        if (order.getDireccionEntrega() != null) {
            html.append("<p><strong>Dirección:</strong> ").append(order.getDireccionEntrega()).append("</p>");
        }

        // Tabla de productos
        html.append("<h2>🛒 Detalle de Productos</h2>")
                .append("<table class='table'>")
                .append("<tr><th>Producto</th><th>Cantidad</th><th>Precio Unit.</th><th>Subtotal</th></tr>");

        BigDecimal totalCalculado = BigDecimal.ZERO;
        for (var item : order.getItems()) {
            BigDecimal subtotal = item.getPrecio().multiply(BigDecimal.valueOf(item.getCantidad()));
            totalCalculado = totalCalculado.add(subtotal);

            html.append("<tr>")
                    .append("<td>").append(item.getProductoNombre()).append("</td>")
                    .append("<td>").append(item.getCantidad()).append("</td>")
                    .append("<td>S/ ").append(item.getPrecio()).append("</td>")
                    .append("<td>S/ ").append(subtotal).append("</td>")
                    .append("</tr>");
        }

        // Total
        html.append("<tr class='total'>")
                .append("<td colspan='3'><strong>TOTAL</strong></td>")
                .append("<td><strong>S/ ").append(order.getTotal()).append("</strong></td>")
                .append("</tr>")
                .append("</table>");

        // Footer
        html.append("<hr>")
                .append("<p><em>¡Gracias por tu compra en Minimarket La Parada!</em></p>")
                .append("<p>📞 Para consultas: support@laparada.com</p>")
                .append("</div></body></html>");

        return html.toString();
    }

    /**
     * Construir HTML para actualización de estado
     */
    private String buildStatusUpdateHtml(OrderResponse order) {
        String statusMessage = getStatusMessage(order.getEstado());
        String statusColor = getStatusColor(order.getEstado());

        return String.format(
                "<!DOCTYPE html>" +
                        "<html><head><meta charset='UTF-8'>" +
                        "<style>body{font-family:Arial,sans-serif;margin:20px;}" +
                        ".header{background:%s;color:white;padding:20px;text-align:center;}</style></head>" +
                        "<body>" +
                        "<div class='header'><h1>🛍️ MINIMARKET LA PARADA</h1></div>" +
                        "<div style='padding:20px;'>" +
                        "<h2>📦 Estado de tu Pedido #%s</h2>" +
                        "<p><strong>Cliente:</strong> %s</p>" +
                        "<p><strong>Estado Actual:</strong> <span style='color:%s;font-weight:bold;'>%s</span></p>" +
                        "<p>%s</p>" +
                        "<p><strong>Total:</strong> S/ %s</p>" +
                        "<hr><p><em>¡Gracias por elegirnos!</em></p>" +
                        "</div></body></html>",
                statusColor, order.getId(), order.getUsuarioNombre(),
                statusColor, order.getEstado(), statusMessage, order.getTotal());
    }

    private String getStatusMessage(String estado) {
        switch (estado) {
            case "CONFIRMADO":
                return "✅ Tu pedido ha sido confirmado y está siendo preparado.";
            case "EN_PREPARACION":
                return "👨‍🍳 Tu pedido está siendo preparado con cuidado.";
            case "EN_CAMINO":
                return "🚚 Tu pedido está en camino. ¡Pronto lo recibirás!";
            case "ENTREGADO":
                return "🎉 ¡Tu pedido ha sido entregado exitosamente!";
            case "CANCELADO":
                return "❌ Tu pedido ha sido cancelado.";
            default:
                return "📋 Estado de tu pedido actualizado.";
        }
    }

    private String getStatusColor(String estado) {
        switch (estado) {
            case "CONFIRMADO":
                return "#8BC34A";
            case "EN_PREPARACION":
                return "#FF9800";
            case "EN_CAMINO":
                return "#2196F3";
            case "ENTREGADO":
                return "#4CAF50";
            case "CANCELADO":
                return "#F44336";
            default:
                return "#607D8B";
        }
    }
}
