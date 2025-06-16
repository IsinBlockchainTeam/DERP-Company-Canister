#!/bin/bash

set -e

echo "Building DERP Company packages..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist types-dist

# Build types package first
echo "🔄 Building types package..."
npm run build-types

# Create types package distribution
echo "📦 Creating types package distribution..."
mkdir -p types-dist/dist
cp package-types.json types-dist/package.json
# Copy the built types to the dist subdirectory
cp -r dist/* types-dist/dist/

echo "✅ Types package built in types-dist/"

# Install the file dependency 
echo "🔄 Installing types dependency..."
npm install

# Clean and build main package
echo "🔄 Building main package..."
npm run clean
npm run build

echo "✅ Main package built in dist/"

echo "🎉 Both packages built successfully!"
echo ""
echo "📝 Usage:"
echo "- Main package: ready to use from dist/"
echo "- Types-only package: cd types-dist && npm publish" 