export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  provider: string;
  hasDiscount: boolean;
  discountValue: number;
  [key: string]: any; // Permite campos adicionais opcionais
}

// 🔥 🔍 Filtro de produtos com suporte a boolean, string e number
export const filterProducts = (
  products: Product[],
  filters: { [key: string]: string | number | boolean },
): Product[] => {
  return products.filter((product) =>
    Object.entries(filters).every(([key, value]) => {
      const productValue = product[key];

      // 🔥 Tratamento específico para boolean
      if (typeof productValue === 'boolean') {
        return String(productValue) === String(value);
      }

      // 🔥 Para outros tipos (string, number)
      return (
        String(productValue ?? '').toLowerCase() === String(value).toLowerCase()
      );
    }),
  );
};

// 🔥 🔍 Busca inteligente, busca parcial
export const searchProducts = (products: any[], query: string) => {
  const words = query.trim().toLowerCase().split(/\s+/); // Divide por espaços

  return products.filter((product) => {
    const fieldsToSearch = [
      product.name,
      product.description,
      product.provider,
      product.category,
      product.details?.material,
      product.details?.adjective,
    ];

    const searchableText = fieldsToSearch
      .filter((field) => typeof field === 'string')
      .map((field) => field.toLowerCase())
      .join(' ');

    // ✅ Verifica se todas as palavras estão presentes
    return words.every((word) => searchableText.includes(word));
  });
};

// 🔥 🧠 Mapeamento padrão dos produtos (retorna formato limpo)
export const mapProducts = (products: Product[]): Product[] => {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.images,
    provider: product.provider,
    hasDiscount: product.hasDiscount,
    discountValue: product.discountValue,
  }));
};
