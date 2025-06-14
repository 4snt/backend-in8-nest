import axios from 'axios';

export const fixImage = async (
  url: string,
  apiKey: string,
): Promise<string> => {
  if (!url) return '';

  const match = url.match(/placeimg\.com\/640\/480\/(\w+)/);
  const category = match ? match[1] : 'random';

  const pixabayUrl = `https://pixabay.com/api/?key=${apiKey}&q=${category}&image_type=photo&per_page=3`;

  try {
    const response = await axios.get(pixabayUrl);

    const hits = response.data.hits;
    if (hits.length > 0) {
      return hits[0].largeImageURL || hits[0].webformatURL;
    }

    return 'https://via.placeholder.com/640x480?text=No+Image+Found';
  } catch (error) {
    console.error('Error fetching image from Pixabay:', error);
    return 'https://via.placeholder.com/640x480?text=No+Image+Error';
  }
};

/**
 * 🔥 Helper para processar um array de imagens
 */
export const fixImagesArray = async (
  rawImages: string[],
  apiKey: string,
  apiUrl: string,
): Promise<string[]> => {
  return Promise.all(
    rawImages.map(async (img) => {
      const fixed = await fixImage(img, apiKey);
      return fixed
        ? `${apiUrl}/api/images/proxy?url=${encodeURIComponent(fixed)}`
        : `${apiUrl}/api/images/proxy?url=${encodeURIComponent(
            'https://via.placeholder.com/640x480?text=No+Image',
          )}`;
    }),
  );
};
