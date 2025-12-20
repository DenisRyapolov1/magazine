import type { ApiResponse, Product } from '../types';

const API_BASE = 'https://noxer-test.ru/webapp/api';

// Mock data for fallback when API is unavailable
const MOCK_DATA: ApiResponse = {
  categories: [
    { Category_ID: 1, Category_Image: "https://static-sda.ru/brandbot/menu/card1.png", Category_Name: "Техника", category_images: null, parent_category_id: null, sort_order: 129 },
    { Category_ID: 2, Category_Image: "https://static-sda.ru/brandbot/menu/card2.png", Category_Name: "Одежда", category_images: null, parent_category_id: null, sort_order: 148 },
    { Category_ID: 3, Category_Image: "https://static-sda.ru/brandbot/menu/card3.png", Category_Name: "Кроссовки", category_images: null, parent_category_id: null, sort_order: 149 },
    { Category_ID: 4, Category_Image: "https://static-sda.ru/brandbot/menu/card4.png", Category_Name: "Сладости", category_images: null, parent_category_id: null, sort_order: 150 },
    { Category_ID: 5, Category_Image: "https://static-sda.ru/brandbot/menu/card5.png", Category_Name: "Наушники", category_images: null, parent_category_id: null, sort_order: 151 },
  ],
  id_mark_for_sale: 1,
  pagination: { current_page: 1, has_next: false, has_prev: false, per_page: 20, total_pages: 1, total_products: 8 },
  products: [
    {
      id: 5043,
      images: [
        { Image_ID: 5211, Image_URL: "https://s3.twcstorage.ru/19dc3eea-8d73649f-6043-4e9c-aefd-53f22d062e74/noxer/user_files/S99976fb59c164d30a4a9c4ab300fb06dl.jpg", MainImage: true, Product_ID: 5043, position: "product", sort_order: 1, title: "" }
      ],
      marks: [{ Mark_Name: "new", color_code: "#45b649" }, { Mark_Name: "hit", color_code: "#ff6723" }],
      name: "тестик свежий",
      old_price: null,
      price: 3000
    },
    {
      id: 5041,
      images: [
        { Image_ID: 5196, Image_URL: "https://s3.twcstorage.ru/19dc3eea-8d73649f-6043-4e9c-aefd-53f22d062e74/noxer/user_files/100032817969b0.webp", MainImage: true, Product_ID: 5041, position: "product", sort_order: 0, title: "" }
      ],
      marks: [{ Mark_Name: "hit", color_code: "#ff6723" }, { Mark_Name: "sale", color_code: "#ffca28" }],
      name: "Товар",
      old_price: null,
      price: 3000
    },
    {
      id: 1728,
      images: [
        { Image_ID: 1926, Image_URL: "https://s3-s1.retailcrm.tech/ru-central1/retailcrm/gadget-f8c6d60da04ace04abd00339eb099d10/product/63736e28af350-ig6jx-ce47zgiwrawyghmfr0iz7ul9kwny5m2zutbihnoemhfmiiewfb4aavpvp0xpwtukk__-m2emi6iugjni0j.jpg", MainImage: true, Product_ID: 1728, sort_order: 0 }
      ],
      marks: [],
      name: "AirPods 2 наушники",
      old_price: null,
      price: 3490
    },
    {
      id: 5,
      images: [
        { Image_ID: 6, Image_URL: "https://static-sda.ru/project/Photo/Airpods_Pro_2/Airpods_pro1.jpg", MainImage: true, Product_ID: 5, position: "product", sort_order: 0, title: "" },
        { Image_ID: 7, Image_URL: "https://static-sda.ru/project/Photo/Airpods_Pro_2/Airpods_pro2.jpg", MainImage: false, Product_ID: 5, position: "product", sort_order: 1, title: "" }
      ],
      marks: [{ Mark_Name: "new", color_code: "#45b649" }, { Mark_Name: "sale", color_code: "#ffca28" }],
      name: "Airpods Pro 3",
      old_price: 55,
      price: 26
    },
    {
      id: 3,
      images: [
        { Image_ID: 4883, Image_URL: "https://noxer-test.ru/webapp/user_files/100032817969b0.webp", MainImage: true, Product_ID: 3, position: "product", sort_order: 0, title: "" }
      ],
      marks: [{ Mark_Name: "premium", color_code: "#292928" }],
      name: "Кроссовки NIKE Gamma Force",
      old_price: null,
      price: 4
    },
    {
      id: 797,
      images: [
        { Image_ID: 4873, Image_URL: "https://noxer-test.ru/webapp/user_files/100032817969b0.webp", MainImage: true, Product_ID: 797, position: "product", sort_order: 0, title: "" }
      ],
      marks: [{ Mark_Name: "hit", color_code: "#ff6723" }, { Mark_Name: "new", color_code: "#45b649" }],
      name: "Рюкзак",
      old_price: 685,
      price: 490
    },
    {
      id: 5209,
      images: [
        { Image_URL: "https://noxer-test.ru/webapp/user_files/test/1r0bfl0x-590x430.webp" }
      ],
      marks: [{ Mark_Name: "hit", color_code: "#ff6723" }, { Mark_Name: "new", color_code: "#45b649" }],
      name: "реальный товар Тумбочка",
      old_price: null,
      price: 10000
    },
    {
      id: 5227,
      images: [
        { Image_ID: 5201, Image_URL: "https://s3.twcstorage.ru/19dc3eea-8d73649f-6043-4e9c-aefd-53f22d062e74/noxer/user_files/55.png", MainImage: true, Product_ID: 5227, position: "product", sort_order: 0, title: "" }
      ],
      marks: [{ Mark_Name: "premium", color_code: "#292928" }],
      name: "тестовый товар удалить",
      old_price: null,
      price: 6000
    }
  ],
  special_project_parameters: {
    footer_link_description: "@noxerai_bot",
    footer_link_value: "https://noxer-ai.ru/bot/api/refs/json?ref=noxer",
    telegram_header_link_value: "https://t.me/noxer_test_bot"
  },
  special_project_parameters_actions: [
    { action_type: "action", description: "крут", extra_field_1: "", extra_field_2: "", id: 22, image_url: "https://noxer-test.ru/webapp/user_files/test/da910b147ba0df0033d916051762afe0.jpg", sort_order: 3, url: null },
    { action_type: "action", description: "Распродажа", extra_field_1: "", extra_field_2: "", id: 18, image_url: "https://s3.twcstorage.ru/19dc3eea-8d73649f-6043-4e9c-aefd-53f22d062e74/noxer/user_files/banner1_compressed.jpg", sort_order: 1, url: null }
  ],
  special_project_parameters_json: {
    fast_search_strings: {
      parameters_list: ["Полуфабрикаты", "Рыба", "Кроссовки", "Наушники", "Техника"]
    }
  },
  status: "ok"
};

export async function fetchMainProducts(): Promise<ApiResponse> {
  try {
    const response = await fetch(`${API_BASE}/products/on_main`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  } catch (error) {
    console.warn('API unavailable, using mock data:', error);
    return MOCK_DATA;
  }
}

export async function fetchFilteredProducts(
  page: number = 1,
  perPage: number = 50,
  filters?: Record<string, unknown>
): Promise<{ products: Product[]; pagination: { has_next: boolean; current_page: number } }> {
  const response = await fetch(`${API_BASE}/products/filter?per_page=${perPage}&page=${page}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filters || {}),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch filtered products');
  }
  return response.json();
}