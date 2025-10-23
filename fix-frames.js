const sharp = require('sharp');
const path = require('path');

async function createVersionsWithFrame() {
  try {
    console.log('🔄 Создаем версии с рамкой 150px...');
    
    const inputPath = path.join(__dirname, 'public', 'tap_head.jpg');
    
    // Получаем метаданные исходного изображения
    const metadata = await sharp(inputPath).metadata();
    console.log('📏 Исходные размеры:', metadata.width, 'x', metadata.height);
    
    // Определяем размер для квадрата
    const squareSize = Math.min(metadata.width, metadata.height);
    const left = Math.floor((metadata.width - squareSize) / 2);
    const top = Math.floor((metadata.height - squareSize) / 2);
    
    console.log('✂️ Обрезаем до квадрата:', squareSize, 'x', squareSize);
    
    // Создаем квадратное изображение
    const squareImageBuffer = await sharp(inputPath)
      .extract({ 
        left: left, 
        top: top, 
        width: squareSize, 
        height: squareSize 
      })
      .toBuffer();
    
    // Размер рамки
    const frameSize = 150;
    
    // 1. Логотип для сайта (оригинальный размер с рамкой)
    const websiteSize = squareSize + (frameSize * 2);
    console.log('🖼️ Создаем логотип для сайта, размер:', websiteSize);
    
    const websiteLogo = await sharp({
      create: {
        width: websiteSize,
        height: websiteSize,
        channels: 3,
        background: { r: 0, g: 0, b: 0 }
      }
    })
    .composite([
      {
        input: squareImageBuffer,
        left: frameSize,
        top: frameSize
      }
    ]);
    
    const websitePath = path.join(__dirname, 'public', 'tap_logo_website.jpg');
    await websiteLogo.jpeg({ quality: 95 }).toFile(websitePath);
    console.log('✅ Логотип для сайта сохранен');
    
    // 2. Иконка 200x200 (создаем заново с рамкой)
    console.log('🔍 Создаем иконку 200x200');
    
    const iconLogo = await sharp({
      create: {
        width: websiteSize,
        height: websiteSize,
        channels: 3,
        background: { r: 0, g: 0, b: 0 }
      }
    })
    .composite([
      {
        input: squareImageBuffer,
        left: frameSize,
        top: frameSize
      }
    ])
    .resize(200, 200, { 
      fit: 'contain',
      background: { r: 0, g: 0, b: 0 }
    });
    
    const iconPath = path.join(__dirname, 'public', 'tap_logo_icon.jpg');
    await iconLogo.jpeg({ quality: 95 }).toFile(iconPath);
    console.log('✅ Иконка сохранена');
    
    // 3. Маленькая иконка 40x40 (создаем заново с рамкой)
    console.log('🔍 Создаем маленькую иконку 40x40');
    
    const smallIcon = await sharp({
      create: {
        width: websiteSize,
        height: websiteSize,
        channels: 3,
        background: { r: 0, g: 0, b: 0 }
      }
    })
    .composite([
      {
        input: squareImageBuffer,
        left: frameSize,
        top: frameSize
      }
    ])
    .resize(40, 40, { 
      fit: 'contain',
      background: { r: 0, g: 0, b: 0 }
    });
    
    const smallIconPath = path.join(__dirname, 'public', 'tap_logo_small.jpg');
    await smallIcon.jpeg({ quality: 95 }).toFile(smallIconPath);
    console.log('✅ Маленькая иконка сохранена');
    
    console.log('🎯 Все версии созданы с одинаковой рамкой 150px!');
    
  } catch (error) {
    console.error('❌ Ошибка при создании версий:', error);
  }
}

createVersionsWithFrame();