# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY app/ .
RUN npm install -g html-minifier terser uglifycss && \
    html-minifier --collapse-whitespace --remove-comments index.html -o index.html && \
    terser script.js -c -m -o script.js && \
    uglifycss style.css > style.min.css && mv style.min.css style.css

# ---- Final Stage ----
FROM amazon/aws-cli AS runtime
# Use lightweight static server
FROM caddy:2.8-alpine
COPY --from=builder /app /usr/share/caddy
EXPOSE 80