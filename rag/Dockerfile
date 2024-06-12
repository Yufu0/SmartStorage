FROM python:3.11

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY rag/requirements.txt /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

RUN apt update

RUN apt install ocrmypdf unpaper -y

RUN apt install tesseract-ocr-fra -y


# Copy the current directory contents into the container at /app
COPY rag/src /app/src

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Launch the app
CMD ["python", "src/app.py"]