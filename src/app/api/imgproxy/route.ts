import { NextRequest, NextResponse } from 'next/server';

/**
 * /api/imgproxy?url=https://...
 * 
 * Proxy de imagens — busca qualquer imagem externamente e serve-a
 * como se fosse local, contornando Cloudflare e hotlink protection.
 * 
 * Uso no template HTML:
 * <img src="/api/imgproxy?url=https://citrusburn.com/images/bottle.png">
 */

// Domínios permitidos (segurança — evitar abuso do proxy)
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  // Validação
  if (!imageUrl) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  // Validar que é uma URL válida
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  // Só permite HTTP/HTTPS
  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    return new NextResponse('Invalid protocol', { status: 400 });
  }

  // Verificar extensão (opcional mas recomendado)
  const pathname = parsedUrl.pathname.toLowerCase();
  const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => pathname.includes(ext));
  
  try {
    // Fetch da imagem com headers que imitam um browser real
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': parsedUrl.origin + '/',
        'sec-fetch-dest': 'image',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'same-origin',
      },
      // Cache de 24 horas para não fazer fetch repetido
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      // Retorna imagem placeholder transparente em vez de erro
      return new NextResponse(null, {
        status: 302,
        headers: {
          'Location': '/api/imgproxy/placeholder',
        },
      });
    }

    // Obter content-type da resposta original
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Só aceitar content-types de imagem
    if (!contentType.startsWith('image/')) {
      return new NextResponse('Not an image', { status: 400 });
    }

    const imageBuffer = await response.arrayBuffer();

    // Servir a imagem com cache headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error: any) {
    console.error('[imgproxy] Erro ao fazer fetch:', imageUrl, error.message);
    
    // Retorna 404 silencioso para não quebrar o layout
    return new NextResponse(null, { status: 404 });
  }
}