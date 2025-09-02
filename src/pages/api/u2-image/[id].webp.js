import unrailedMaps from '@/data/unrailedMaps.json';
import sharp from 'sharp';

export async function GET({ params, request }) {
  const response = await fetch(
    `https://u2.unrailed-online.com/CustomMap/Screenshot/${params.id}`,
  );

  const imageBuffer = await response.arrayBuffer();

  // Sharpを使って画像をリサイズし、WebPに変換
  const resizedImageBuffer = await sharp(imageBuffer)
    .resize(640)
    .webp({ quality: 80 })
    .toBuffer();

  return new Response(resizedImageBuffer, {
    headers: { 'Content-Type': 'image/webp' },
  });
}

export function getStaticPaths() {
  return unrailedMaps.map((map) => ({ params: { id: map.customMapId } }));
}
