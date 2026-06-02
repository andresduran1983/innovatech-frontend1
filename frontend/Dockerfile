# ==========================================
# Servidor Web Nginx para Sitio Estático
# ==========================================
FROM nginx:alpine

# --- CONFIGURACIÓN DE MÍNIMO PRIVILEGIO (Pauta IE1) ---
# Creamos y damos permisos a los archivos que usa Nginx para que no corra como root
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx /var/log/nginx /etc/nginx/conf.d

# Copiamos tu configuración personalizada de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiamos directamente tus archivos estáticos al directorio público de Nginx
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

# Cambiamos al usuario 'nginx' (no-root) por seguridad de la pauta
USER nginx

# Exponemos el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]