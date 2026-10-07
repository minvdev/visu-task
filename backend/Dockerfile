FROM python:3.14-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Fix line endings for Windows users and make executable
RUN sed -i 's/\r$//' boot.sh && chmod +x boot.sh

EXPOSE 8000

ENTRYPOINT [ "./boot.sh" ]