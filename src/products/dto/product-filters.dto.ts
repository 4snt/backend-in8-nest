export class ProductFiltersDto {
  query?: string;
  provider?: 'br' | 'eu';
  hasDiscount?: boolean;
  [key: string]: any; // 🔥 Permite filtros dinâmicos extras se quiser
}
