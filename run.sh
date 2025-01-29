docker build -t kintumiku/juice-shop .
docker push kintumiku/juice-shop
docker run --rm -p 127.0.0.1:3000:3000 kintumiku/juice-shop
