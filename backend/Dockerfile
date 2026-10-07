FROM python:3.14-slim

WORKDIR /app

COPY pyproject.toml .
COPY src ./src

RUN pip install --no-cache-dir . --group dev

COPY . .

# Fix line endings for Windows users and make executable
RUN sed -i 's/\r$//' boot.sh && chmod +x boot.sh

EXPOSE 8000

ENTRYPOINT [ "./boot.sh" ]