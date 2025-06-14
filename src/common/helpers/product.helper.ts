export const searchProducts = (products: any[], query: string) => {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category?.toLowerCase().includes(lowerQuery) ||
      product.provider?.toLowerCase().includes(lowerQuery),
  );
};

export const filterProducts = (
  products: any[],
  filters: {
    category?: string;
    hasDiscount?: boolean;
    minPrice?: number;
    maxPrice?: number;
  },
) => {
  return products.filter((product) => {
    const matchCategory = filters.category
      ? product.category?.toLowerCase() === filters.category.toLowerCase()
      : true;

    const matchDiscount =
      filters.hasDiscount !== undefined
        ? Boolean(product.hasDiscount) === Boolean(filters.hasDiscount)
        : true;

    const matchMinPrice =
      filters.minPrice !== undefined
        ? product.price >= Number(filters.minPrice)
        : true;

    const matchMaxPrice =
      filters.maxPrice !== undefined
        ? product.price <= Number(filters.maxPrice)
        : true;

    return matchCategory && matchDiscount && matchMinPrice && matchMaxPrice;
  });
};

export const mapProducts = (products: any[]) => {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    images: product.images,
    provider: product.provider,
    category: product.category,
    hasDiscount: product.hasDiscount,
    discountValue: product.discountValue,
  }));
};
