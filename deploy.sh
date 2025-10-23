#!/bin/bash
# Deploy script for testing.tap-22.ru

echo "🚀 Starting deployment to testing.tap-22.ru"

# Build the project
echo "📦 Building project..."
npm run build

# Create deployment package
echo "📁 Creating deployment package..."
tar -czf tap22-deployment.tar.gz \
  .next \
  public \
  package.json \
  package-lock.json \
  next.config.js \
  middleware.ts \
  app \
  components \
  lib \
  .env.production.local

echo "✅ Deployment package created: tap22-deployment.tar.gz"
echo ""
echo "📋 Next steps:"
echo "1. Upload tap22-deployment.tar.gz to server"
echo "2. Extract on server: tar -xzf tap22-deployment.tar.gz"
echo "3. Install dependencies: npm ci --production"
echo "4. Start application: npm start"
echo ""
echo "🔧 Server commands:"
echo "scp tap22-deployment.tar.gz j8808879@j8808879.myjino.ru:~/"
echo "ssh j8808879@j8808879.myjino.ru"

