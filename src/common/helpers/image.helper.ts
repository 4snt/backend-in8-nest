import axios from 'axios';

const imageCache = new Map<string, string>();

export const fixImage = async (
  url: string,
  apiKey: string,
  fallbackCategory = 'product',
): Promise<string> => {
  if (!url) {
    return `${process.env.API_URL}/placeholder.webp`;
  }

  if (imageCache.has(url)) {
    return imageCache.get(url)!;
  }

  // 🔍 Extrai categoria da URL, se possível
  const match = url.match(/placeimg\.com\/640\/480\/(\w+)/);
  const category = match ? match[1] : fallbackCategory;

  const pixabayUrl = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
    category,
  )}&image_type=photo&per_page=3`;

  try {
    const response = await axios.get(pixabayUrl);
    const hits = response.data.hits;

    const finalImage =
      hits.length > 0
        ? hits[0].largeImageURL || hits[0].webformatURL
        : `${process.env.API_URL}/placeholder.webp`;

    // 🔥 Salva no cache
    imageCache.set(url, finalImage);

    return finalImage;
  } catch (error) {
    console.error('Error fetching image from Pixabay:', error);
    return `${process.env.API_URL}/placeholder.webp`;
  }
};

export const fixImagesArray = async (
  rawImages: string[],
  apiKey: string,
  apiUrl: string,
): Promise<string[]> => {
  return Promise.all(
    rawImages.map(async (img) => {
      const fixed = await fixImage(img, apiKey);
      return `${apiUrl}/api/images/proxy?url=${encodeURIComponent(fixed)}`;
    }),
  );
};
