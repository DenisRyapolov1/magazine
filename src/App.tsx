import { useState, useEffect, useCallback, useMemo } from 'react';
import './styles/index.css';
import type { Product, Category, ApiResponse } from './types';
import { fetchMainProducts, fetchFilteredProducts } from './api';

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.5" cy="7.5" r="6" stroke="#B5B5B5" strokeWidth="1.5"/>
    <path d="M12 12L16 16" stroke="#B5B5B5" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TelegramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="12" fill="url(#tg-gradient)"/>
    <path d="M17.0909 7.5L15.1818 16.5C15.1818 16.5 14.9091 17.25 14.0909 16.875L10.0909 13.875L8.54545 13.125L5.72727 12.1875C5.72727 12.1875 5.27273 12.0375 5.22727 11.6625C5.18182 11.2875 5.74091 11.0625 5.74091 11.0625L16.0909 7.0625C16.0909 7.0625 17.0909 6.625 17.0909 7.5Z" fill="white"/>
    <defs>
      <linearGradient id="tg-gradient" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#37AEE2"/>
        <stop offset="1" stopColor="#1E96C8"/>
      </linearGradient>
    </defs>
  </svg>
);

const CloseIcon = () => (
  <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L6 6M6 1L1 6" stroke="#666666" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="12" height="6" viewBox="0 0 12 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="2" cy="3" r="1.5" fill="#666666"/>
    <circle cx="6" cy="3" r="1.5" fill="#666666"/>
    <circle cx="10" cy="3" r="1.5" fill="#666666"/>
  </svg>
);

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M10 17.5L8.55 16.175C4.4 12.4 1.5 9.775 1.5 6.5C1.5 3.825 3.575 1.75 6.25 1.75C7.775 1.75 9.225 2.475 10 3.6C10.775 2.475 12.225 1.75 13.75 1.75C16.425 1.75 18.5 3.825 18.5 6.5C18.5 9.775 15.6 12.4 11.45 16.175L10 17.5Z" 
      fill={filled ? "#FE646F" : "white"}
      stroke={filled ? "#FE646F" : "#6C6C6C"}
      strokeWidth="1.3"
    />
  </svg>
);

const SmallTelegramIcon = () => (
  <svg width="11" height="10" viewBox="0 0 11 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5 1L7.5 9L5.5 5.5L1 4L10.5 1Z" fill="#37AEE2"/>
  </svg>
);

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f1f1f1"/><text x="100" y="100" text-anchor="middle" dominant-baseline="middle" fill="#b5b5b5" font-family="Arial" font-size="14">Нет фото</text></svg>');

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
};

const calculateDiscount = (price: number, oldPrice: number): number => {
  return Math.round(((oldPrice - price) / oldPrice) * 100);
};

const getMainImage = (product: Product): string => {
  const mainImage = product.images.find(img => img.MainImage);
  if (mainImage) {
    return mainImage.Image_URL || mainImage.image_url || '';
  }
  const firstImage = product.images[0];
  if (firstImage) {
    return firstImage.Image_URL || firstImage.image_url || '';
  }
  return '';
};

const getTagClass = (markName: string): string => {
  const name = markName.toLowerCase();
  if (name === 'hit') return 'product-card__tag--hit';
  if (name === 'sale') return 'product-card__tag--sale';
  if (name === 'new') return 'product-card__tag--new';
  if (name === 'premium') return 'product-card__tag--premium';
  return '';
};

const getTagName = (markName: string): string => {
  const name = markName.toLowerCase();
  if (name === 'hit') return 'хит';
  if (name === 'sale') return 'sale';
  if (name === 'new') return 'new';
  if (name === 'premium') return 'премиум';
  return markName;
};

function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchMainProducts();
        setData(response);
        setProducts(response.products);
        setHasMore(response.pagination.has_next);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!data?.special_project_parameters_actions?.length) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex(prev => 
        (prev + 1) % data.special_project_parameters_actions.length
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [data?.special_project_parameters_actions?.length]);

  const fastSearchStrings = useMemo(() => {
    return data?.special_project_parameters_json?.fast_search_strings?.parameters_list || [];
  }, [data]);

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (selectedCategory) {
      const categoryName = selectedCategory.Category_Name.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(categoryName) ||
        (product as any).category_id === selectedCategory.Category_ID
      );
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [products, searchQuery, selectedCategory]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [products, searchQuery]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const response = await fetchFilteredProducts(page + 1, 50);
      setProducts(prev => [...prev, ...response.products]);
      setPage(prev => prev + 1);
      setHasMore(response.pagination.has_next);
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore]);

  const toggleFavorite = useCallback((productId: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchDropdown(true);
  };

  const handleFastSearchClick = (query: string) => {
    setSearchQuery(query);
    setShowSearchDropdown(false);
  };

  const handleCategoryClick = useCallback((category: Category) => {
    console.log('Category clicked:', category.Category_Name, category.Category_ID);
    if (selectedCategory?.Category_ID === category.Category_ID) {
      setSelectedCategory(null);
      setSearchQuery('');
    } else {
      setSelectedCategory(category);
      setSearchQuery('');
    }
    setShowSearchDropdown(false);
  }, [selectedCategory]);

  const clearCategoryFilter = useCallback(() => {
    setSelectedCategory(null);
    setSearchQuery('');
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    console.log('Product clicked:', product.name, product.id);
    alert(`Товар: ${product.name}\nЦена: ${formatPrice(product.price)}\nID: ${product.id}`);
  }, []);

  const displayCategories = useMemo(() => {
    if (!data?.categories) return [];
    return data.categories
      .filter(cat => cat.Category_Image || (cat.category_images && cat.category_images.length > 0))
      .slice(0, 5);
  }, [data?.categories]);

  const currentBanner = useMemo(() => {
    if (!data?.special_project_parameters_actions?.length) return null;
    return data.special_project_parameters_actions[currentBannerIndex];
  }, [data?.special_project_parameters_actions, currentBannerIndex]);

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading__spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {}
      <header className="header">
        <button className="header__btn">
          <CloseIcon />
          <span>Закрыть</span>
        </button>
        
        <a 
          href="https://t.me/Don4ik1"
          target="_blank" 
          rel="noopener noreferrer"
          className="header__tg-btn"
        >
          <TelegramIcon />
          <span className="header__tg-text">ТГ Денчика</span>
        </a>
        
        <button className="header__more-btn">
          <MoreIcon />
        </button>
      </header>

      {}
      <div className="search">
        <div className="search__input-wrapper">
          <SearchIcon />
          <input
            type="text"
            className="search__input"
            placeholder="Найти товары"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
          />
        </div>

        {}
        {showSearchDropdown && !searchQuery && fastSearchStrings.length > 0 && (
          <div className="search-dropdown">
            <div className="search-dropdown__title">Часто ищут</div>
            {fastSearchStrings.map((item, index) => (
              <div key={index}>
                <div 
                  className="search-dropdown__item"
                  onClick={() => handleFastSearchClick(item)}
                >
                  <SearchIcon />
                  <span className="search-dropdown__item-text">{item}</span>
                </div>
                {index < fastSearchStrings.length - 1 && (
                  <div className="search-dropdown__divider"></div>
                )}
              </div>
            ))}
          </div>
        )}

        {}
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(product => (
              <div key={product.id} className="search-result-card" onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                <img 
                  src={getMainImage(product) || PLACEHOLDER_IMAGE} 
                  alt={product.name}
                  className="search-result-card__image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                />
                <div className="search-result-card__info">
                  <div className="search-result-card__name">{product.name}</div>
                  <div className="search-result-card__price-wrapper">
                    <span className="search-result-card__price">
                      {formatPrice(product.price)}
                    </span>
                    {product.old_price && (
                      <>
                        <span className="search-result-card__old-price">
                          {formatPrice(product.old_price)}
                        </span>
                        <span className="search-result-card__discount">
                          -{calculateDiscount(product.price, product.old_price)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      {currentBanner && (
        <div className="banner">
          <img 
            src={currentBanner.image_url} 
            alt={currentBanner.description}
            className="banner__image"
          />
          {data?.special_project_parameters_actions && data.special_project_parameters_actions.length > 1 && (
            <div className="banner__dots">
              {data.special_project_parameters_actions.map((_, index) => (
                <div 
                  key={index}
                  className={`banner__dot ${index === currentBannerIndex ? 'banner__dot--active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {}
      {displayCategories.length > 0 && (
        <div className="categories">
          {displayCategories.map(category => (
            <CategoryCard 
              key={category.Category_ID} 
              category={category}
              isSelected={selectedCategory?.Category_ID === category.Category_ID}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      )}

      {}
      {selectedCategory && (
        <div className="category-filter">
          <span className="category-filter__text">
            Категория: {selectedCategory.Category_Name}
          </span>
          <button className="category-filter__clear" onClick={clearCategoryFilter}>
            ✕
          </button>
        </div>
      )}

      {}
      {filteredProducts.length > 0 ? (
        <div className="products">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product}
              isFavorite={favorites.has(product.id)}
              onToggleFavorite={() => toggleFavorite(product.id)}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <div className="no-results__icon">🔍</div>
          <div className="no-results__text">Товары не найдены</div>
        </div>
      )}

      {}
      {hasMore && !searchQuery && (
        <div className="load-more">
          <button 
            className="load-more__btn"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Загрузка...' : 'Загрузить ещё'}
          </button>
        </div>
      )}

      {}
      <footer className="footer">
        <div className="footer__developer">
          <a 
            href="https://t.me/Don4ik1"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__tg-link"
          >
            <SmallTelegramIcon />
            <span className="footer__tg-text">
            </span>
          </a>
        </div>
      </footer>

      {}
      <BottomNavigation />
    </div>
  );
}

const HomeIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M3 7.5L10.5 2L18 7.5V17C18 17.5304 17.7893 18.0391 17.4142 18.4142C17.0391 18.7893 16.5304 19 16 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V7.5Z" 
      stroke={active ? "#292928" : "#85858B"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill={active ? "#292928" : "none"}
    />
    <path 
      d="M8 19V10.5H13V19" 
      stroke={active ? "#292928" : "#85858B"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const CatalogIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="7" height="7" rx="1.5" stroke={active ? "#292928" : "#85858B"} strokeWidth="1.5" fill={active ? "#292928" : "none"}/>
    <rect x="12" y="2" width="7" height="7" rx="1.5" stroke={active ? "#292928" : "#85858B"} strokeWidth="1.5" fill={active ? "#292928" : "none"}/>
    <rect x="2" y="12" width="7" height="7" rx="1.5" stroke={active ? "#292928" : "#85858B"} strokeWidth="1.5" fill={active ? "#292928" : "none"}/>
    <rect x="12" y="12" width="7" height="7" rx="1.5" stroke={active ? "#292928" : "#85858B"} strokeWidth="1.5" fill={active ? "#292928" : "none"}/>
  </svg>
);

const CartIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M5 2L3 5V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V5L16 2H5Z" 
      stroke={active ? "#292928" : "#85858B"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill={active ? "#292928" : "none"}
    />
    <path 
      d="M3 5H18" 
      stroke={active ? "#292928" : "#85858B"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M14 8C14 9.06087 13.5786 10.0783 12.8284 10.8284C12.0783 11.5786 11.0609 12 10 12C8.93913 12 7.92172 11.5786 7.17157 10.8284C6.42143 10.0783 6 9.06087 6 8" 
      stroke={active ? "#fff" : "#85858B"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const ProfileIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M17.5 18.5V16.5C17.5 15.4391 17.0786 14.4217 16.3284 13.6716C15.5783 12.9214 14.5609 12.5 13.5 12.5H7.5C6.43913 12.5 5.42172 12.9214 4.67157 13.6716C3.92143 14.4217 3.5 15.4391 3.5 16.5V18.5" 
      stroke={active ? "#292928" : "#85858B"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M10.5 9.5C12.7091 9.5 14.5 7.70914 14.5 5.5C14.5 3.29086 12.7091 1.5 10.5 1.5C8.29086 1.5 6.5 3.29086 6.5 5.5C6.5 7.70914 8.29086 9.5 10.5 9.5Z" 
      stroke={active ? "#292928" : "#85858B"} 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill={active ? "#292928" : "none"}
    />
  </svg>
);

const SearchNavIcon = ({ active = false }: { active?: boolean }) => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9.5" cy="9.5" r="6" stroke={active ? "#292928" : "#85858B"} strokeWidth="1.5"/>
    <path d="M14 14L18 18" stroke={active ? "#292928" : "#85858B"} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

function BottomNavigation() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__container">
        <button 
          className={`bottom-nav__item ${activeTab === 'home' ? 'bottom-nav__item--active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <HomeIcon active={activeTab === 'home'} />
        </button>
        <button 
          className={`bottom-nav__item ${activeTab === 'catalog' ? 'bottom-nav__item--active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <CatalogIcon active={activeTab === 'catalog'} />
        </button>
        <button 
          className={`bottom-nav__item ${activeTab === 'cart' ? 'bottom-nav__item--active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          <CartIcon active={activeTab === 'cart'} />
        </button>
        <button 
          className={`bottom-nav__item ${activeTab === 'profile' ? 'bottom-nav__item--active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <ProfileIcon active={activeTab === 'profile'} />
        </button>
        <button 
          className={`bottom-nav__item ${activeTab === 'search' ? 'bottom-nav__item--active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <SearchNavIcon active={activeTab === 'search'} />
        </button>
      </div>
    </nav>
  );
}

function CategoryCard({ category, isSelected, onClick }: { category: Category; isSelected: boolean; onClick: () => void }) {
  const imageUrl = category.category_images?.[0]?.url || category.Category_Image || '';
  
  return (
    <div 
      className={`category-card ${isSelected ? 'category-card--selected' : ''}`} 
      onClick={onClick} 
      style={{ cursor: 'pointer' }}
    >
      <img 
        src={imageUrl || PLACEHOLDER_IMAGE} 
        alt={category.Category_Name}
        className="category-card__image"
        onError={(e) => {
          (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
        }}
      />
      <span className="category-card__name">{category.Category_Name}</span>
    </div>
  );
}

function ProductCard({ 
  product, 
  isFavorite, 
  onToggleFavorite,
  onClick
}: { 
  product: Product; 
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}) {
  const imageUrl = getMainImage(product);
  const hasMultipleImages = product.images.length > 1;
  
  return (
    <div className="product-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="product-card__image-wrapper">
        <img 
          src={imageUrl || PLACEHOLDER_IMAGE} 
          alt={product.name}
          className="product-card__image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
          }}
        />
        
        {}
        {product.marks.length > 0 && (
          <div className="product-card__tags">
            {product.marks.slice(0, 2).map((mark, index) => (
              <span 
                key={index}
                className={`product-card__tag ${getTagClass(mark.Mark_Name)}`}
                style={{ backgroundColor: mark.color_code }}
              >
                {getTagName(mark.Mark_Name)}
              </span>
            ))}
          </div>
        )}
        
        {}
        <div className="product-card__like" onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}>
          <HeartIcon filled={isFavorite} />
        </div>
        
        {}
        {hasMultipleImages && (
          <div className="product-card__dots">
            {product.images.slice(0, 5).map((_, index) => (
              <div 
                key={index}
                className={`product-card__dot ${index === 0 ? 'product-card__dot--active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="product-card__info">
        <div className="product-card__price-wrapper">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          {product.old_price && (
            <>
              <span className="product-card__old-price">{formatPrice(product.old_price)}</span>
              <span className="product-card__discount">
                -{calculateDiscount(product.price, product.old_price)}%
              </span>
            </>
          )}
        </div>
        <div className="product-card__name">{product.name}</div>
        <button className="product-card__btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>Выбрать</button>
      </div>
    </div>
  );
}

export default App;