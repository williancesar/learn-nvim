/**
 * Day 10: Visual Mode Practice with TypeScript
 *
 * This file contains interfaces and types designed for visual mode selection practice.
 * Practice these visual mode commands:
 * - v: Character-wise visual mode
 * - V: Line-wise visual mode
 * - Ctrl-v: Block-wise visual mode
 * - o: Move to other end of selection
 * - gv: Re-select last visual selection
 * - aw: Select a word (including whitespace)
 * - iw: Select inner word
 * - ap: Select a paragraph
 * - ip: Select inner paragraph
 * - a): Select around parentheses
 * - i): Select inside parentheses
 * - a]: Select around brackets
 * - i]: Select inside brackets
 * - a}: Select around braces
 * - i}: Select inside braces
 * - a": Select around double quotes
 * - i": Select inside double quotes
 * - at: Select around XML/HTML tags
 * - it: Select inside XML/HTML tags
 */

// E-commerce platform interfaces for visual mode practice
interface ProductCatalog {
  categories: ProductCategory[];
  products: Product[];
  brands: Brand[];
  filters: FilterOptions;
  searchConfig: SearchConfiguration;
  recommendations: RecommendationEngine;
}

interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  children: ProductCategory[];
  image: ImageAsset;
  seoMetadata: SeoMetadata;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  brand: Brand;
  variants: ProductVariant[];
  images: ImageAsset[];
  videos: VideoAsset[];
  documents: DocumentAsset[];
  pricing: ProductPricing;
  inventory: InventoryInfo;
  shipping: ShippingInfo;
  attributes: ProductAttribute[];
  tags: string[];
  seoMetadata: SeoMetadata;
  reviews: ProductReview[];
  isActive: boolean;
  isFeatured: boolean;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  options: VariantOption[];
  pricing: ProductPricing;
  inventory: InventoryInfo;
  images: ImageAsset[];
  isDefault: boolean;
  isActive: boolean;
  sortOrder: number;
}

interface VariantOption {
  type: 'color' | 'size' | 'material' | 'style' | 'capacity' | 'custom';
  name: string;
  value: string;
  displayValue: string;
  colorCode?: string;
  image?: ImageAsset;
  priceModifier?: PriceModifier;
}

interface ProductPricing {
  basePrice: Money;
  salePrice?: Money;
  msrp?: Money;
  costPrice?: Money;
  discounts: PriceDiscount[];
  tiers: PriceTier[];
  taxInfo: TaxInformation;
  currency: Currency;
  priceValidFrom: Date;
  priceValidTo?: Date;
}

interface Money {
  amount: number;
  currency: Currency;
  formatted: string;
  symbol: string;
}

interface Currency {
  code: string; // ISO 4217 currency code
  name: string;
  symbol: string;
  decimalPlaces: number;
  exchangeRate?: number;
}

interface PriceDiscount {
  id: string;
  type: 'percentage' | 'fixed' | 'buy-x-get-y' | 'bulk';
  value: number;
  description: string;
  conditions: DiscountCondition[];
  validFrom: Date;
  validTo?: Date;
  isActive: boolean;
}

interface DiscountCondition {
  type: 'quantity' | 'amount' | 'customer-group' | 'location' | 'product' | 'category';
  operator: 'equals' | 'greater-than' | 'less-than' | 'in' | 'not-in';
  value: string | number | string[] | number[];
}

interface PriceTier {
  minQuantity: number;
  maxQuantity?: number;
  price: Money;
  discountPercentage?: number;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: ImageAsset;
  website?: string;
  socialMedia: SocialMediaLinks;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SocialMediaLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  tiktok?: string;
}

interface ImageAsset {
  id: string;
  url: string;
  alt: string;
  title?: string;
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  variants: ImageVariant[];
  tags: string[];
  createdAt: Date;
}

interface ImageVariant {
  size: 'thumbnail' | 'small' | 'medium' | 'large' | 'xlarge' | 'original';
  url: string;
  width: number;
  height: number;
  quality: number;
}

interface VideoAsset {
  id: string;
  url: string;
  title: string;
  description?: string;
  duration: number; // in seconds
  thumbnail: ImageAsset;
  fileSize: number;
  mimeType: string;
  quality: '480p' | '720p' | '1080p' | '4k';
  isActive: boolean;
  createdAt: Date;
}

interface DocumentAsset {
  id: string;
  name: string;
  url: string;
  type: 'manual' | 'specification' | 'warranty' | 'certificate' | 'other';
  fileSize: number;
  mimeType: string;
  language: string;
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface InventoryInfo {
  trackInventory: boolean;
  stockQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  allowBackorders: boolean;
  backorderLimit?: number;
  stockStatus: 'in-stock' | 'out-of-stock' | 'low-stock' | 'backorder';
  warehouse: WarehouseLocation;
  suppliers: SupplierInfo[];
  lastRestocked: Date;
  nextRestockDate?: Date;
}

interface WarehouseLocation {
  id: string;
  name: string;
  address: Address;
  capacity: number;
  currentUtilization: number;
  isActive: boolean;
}

interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: GeoCoordinates;
}

interface GeoCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface SupplierInfo {
  id: string;
  name: string;
  contactInfo: ContactInformation;
  leadTime: number; // in days
  minimumOrderQuantity: number;
  pricePerUnit: Money;
  isPreferred: boolean;
  reliability: number; // 0-100 score
}

interface ContactInformation {
  primaryContact: PersonContact;
  alternativeContacts: PersonContact[];
  companyPhone?: string;
  companyEmail?: string;
  website?: string;
  address: Address;
}

interface PersonContact {
  name: string;
  title: string;
  phone?: string;
  email?: string;
  department?: string;
}

interface ShippingInfo {
  weight: PhysicalDimensions;
  dimensions: PhysicalDimensions;
  shippingClass: ShippingClass;
  restrictions: ShippingRestriction[];
  freeShippingEligible: boolean;
  expeditedShippingAvailable: boolean;
  internationalShippingAllowed: boolean;
}

interface PhysicalDimensions {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  unit: 'cm' | 'in' | 'g' | 'kg' | 'lb' | 'oz';
}

interface ShippingClass {
  id: string;
  name: string;
  description: string;
  baseCost: Money;
  estimatedDeliveryDays: number;
  trackingIncluded: boolean;
  insuranceIncluded: boolean;
}

interface ShippingRestriction {
  type: 'location' | 'method' | 'size' | 'weight' | 'hazmat' | 'fragile';
  description: string;
  affectedRegions?: string[];
  alternativeOptions?: string[];
}

interface ProductAttribute {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'multiselect' | 'color' | 'file';
  value: string | number | boolean | Date | string[] | FileAsset;
  displayName: string;
  isVisible: boolean;
  isFilterable: boolean;
  sortOrder: number;
  group?: AttributeGroup;
}

interface AttributeGroup {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
  isCollapsible: boolean;
  isCollapsedByDefault: boolean;
}

interface FileAsset {
  id: string;
  filename: string;
  url: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
}

interface ProductReview {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  images?: ImageAsset[];
  videos?: VideoAsset[];
  isVerifiedPurchase: boolean;
  isRecommended: boolean;
  helpfulVotes: number;
  unhelpfulVotes: number;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  responses: ReviewResponse[];
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewResponse {
  id: string;
  reviewId: string;
  respondentType: 'customer' | 'merchant' | 'moderator';
  respondentName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  openGraph?: OpenGraphData;
  twitterCard?: TwitterCardData;
  jsonLd?: StructuredData[];
}

interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'product' | 'website' | 'article';
  siteName?: string;
  locale?: string;
}

interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title: string;
  description: string;
  image?: string;
}

interface StructuredData {
  type: string;
  context: string;
  data: Record<string, any>;
}

interface FilterOptions {
  priceRange: PriceRangeFilter;
  categories: CategoryFilter[];
  brands: BrandFilter[];
  attributes: AttributeFilter[];
  availability: AvailabilityFilter;
  rating: RatingFilter;
  customFilters: CustomFilter[];
}

interface PriceRangeFilter {
  min: number;
  max: number;
  step: number;
  currency: Currency;
  includeSale: boolean;
}

interface CategoryFilter {
  categoryId: string;
  name: string;
  productCount: number;
  children?: CategoryFilter[];
  isSelected: boolean;
}

interface BrandFilter {
  brandId: string;
  name: string;
  productCount: number;
  logo?: ImageAsset;
  isSelected: boolean;
}

interface AttributeFilter {
  attributeId: string;
  name: string;
  type: ProductAttribute['type'];
  options: FilterOption[];
  isMultiSelect: boolean;
}

interface FilterOption {
  value: string;
  label: string;
  productCount: number;
  isSelected: boolean;
  colorCode?: string;
  image?: ImageAsset;
}

interface AvailabilityFilter {
  inStock: boolean;
  outOfStock: boolean;
  backorder: boolean;
  preorder: boolean;
}

interface RatingFilter {
  minimumRating: number;
  includeUnrated: boolean;
}

interface CustomFilter {
  id: string;
  name: string;
  type: 'range' | 'checkbox' | 'radio' | 'dropdown' | 'multiselect';
  options: FilterOption[];
  configuration: Record<string, any>;
}

interface SearchConfiguration {
  engine: SearchEngine;
  indexing: IndexingConfiguration;
  synonyms: SynonymGroup[];
  stopWords: string[];
  boostFields: FieldBoost[];
  facets: FacetConfiguration[];
  autocomplete: AutocompleteConfiguration;
}

interface SearchEngine {
  provider: 'elasticsearch' | 'solr' | 'algolia' | 'custom';
  version: string;
  endpoint: string;
  authentication: AuthenticationConfig;
  performance: PerformanceConfig;
}

interface AuthenticationConfig {
  type: 'none' | 'basic' | 'api-key' | 'oauth2';
  credentials: Record<string, string>;
}

interface PerformanceConfig {
  timeout: number;
  maxRetries: number;
  cacheTtl: number;
  batchSize: number;
}

interface IndexingConfiguration {
  schedule: CronSchedule;
  batchSize: number;
  fields: IndexedField[];
  transforms: DataTransform[];
  filters: IndexingFilter[];
}

interface CronSchedule {
  expression: string;
  timezone: string;
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

interface IndexedField {
  name: string;
  type: 'text' | 'keyword' | 'number' | 'date' | 'boolean' | 'geo';
  analyzer?: string;
  boost?: number;
  isSearchable: boolean;
  isFacetable: boolean;
  isFilterable: boolean;
  isSortable: boolean;
}

interface DataTransform {
  field: string;
  operation: 'lowercase' | 'uppercase' | 'trim' | 'replace' | 'extract' | 'custom';
  parameters: Record<string, any>;
}

interface IndexingFilter {
  field: string;
  condition: string;
  value: any;
}

interface SynonymGroup {
  id: string;
  terms: string[];
  type: 'equivalent' | 'oneway';
  isActive: boolean;
}

interface FieldBoost {
  field: string;
  boost: number;
  condition?: string;
}

interface FacetConfiguration {
  field: string;
  displayName: string;
  type: 'terms' | 'range' | 'histogram' | 'date_histogram';
  size?: number;
  minCount?: number;
  sortBy: 'count' | 'alpha';
  sortOrder: 'asc' | 'desc';
}

interface AutocompleteConfiguration {
  isEnabled: boolean;
  minQueryLength: number;
  maxSuggestions: number;
  fields: string[];
  popularQueries: PopularQuery[];
}

interface PopularQuery {
  query: string;
  count: number;
  boost: number;
}

interface RecommendationEngine {
  algorithms: RecommendationAlgorithm[];
  rules: RecommendationRule[];
  personalization: PersonalizationConfig;
  abTesting: ABTestConfiguration;
}

interface RecommendationAlgorithm {
  type: 'collaborative-filtering' | 'content-based' | 'hybrid' | 'trending' | 'recently-viewed';
  weight: number;
  configuration: Record<string, any>;
  isActive: boolean;
}

interface RecommendationRule {
  id: string;
  name: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  priority: number;
  isActive: boolean;
}

interface RuleCondition {
  type: 'product' | 'category' | 'customer' | 'cart' | 'time' | 'location';
  field: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than' | 'in-range';
  value: any;
}

interface RuleAction {
  type: 'boost' | 'bury' | 'include' | 'exclude' | 'replace';
  parameters: Record<string, any>;
}

interface PersonalizationConfig {
  isEnabled: boolean;
  trackingMethods: TrackingMethod[];
  segments: CustomerSegment[];
  coldStartStrategy: ColdStartStrategy;
}

interface TrackingMethod {
  type: 'cookies' | 'local-storage' | 'server-session' | 'user-account';
  configuration: Record<string, any>;
  isActive: boolean;
}

interface CustomerSegment {
  id: string;
  name: string;
  criteria: SegmentCriteria[];
  recommendations: SegmentRecommendation[];
}

interface SegmentCriteria {
  field: string;
  operator: string;
  value: any;
}

interface SegmentRecommendation {
  type: string;
  configuration: Record<string, any>;
  weight: number;
}

interface ColdStartStrategy {
  fallbackRecommendations: 'trending' | 'recent' | 'popular' | 'featured';
  collectImplicitFeedback: boolean;
  explicitFeedbackPrompts: boolean;
}

interface ABTestConfiguration {
  isEnabled: boolean;
  tests: ABTest[];
  trafficAllocation: TrafficAllocation;
}

interface ABTest {
  id: string;
  name: string;
  variants: TestVariant[];
  startDate: Date;
  endDate?: Date;
  metrics: TestMetric[];
  isActive: boolean;
}

interface TestVariant {
  id: string;
  name: string;
  trafficPercentage: number;
  configuration: Record<string, any>;
}

interface TestMetric {
  name: string;
  type: 'conversion' | 'revenue' | 'engagement' | 'retention';
  target: number;
  improvement: number;
}

interface TrafficAllocation {
  strategy: 'random' | 'hash' | 'weighted';
  seed?: string;
  excludeReturningUsers: boolean;
}

interface TaxInformation {
  taxClass: string;
  taxRate: number;
  taxInclusive: boolean;
  exemptions: TaxExemption[];
  rules: TaxRule[];
}

interface TaxExemption {
  type: 'customer-group' | 'location' | 'product-category';
  conditions: Record<string, any>;
  exemptionRate: number;
}

interface TaxRule {
  jurisdiction: string;
  rate: number;
  isCompound: boolean;
  priority: number;
}

interface PriceModifier {
  type: 'fixed' | 'percentage';
  amount: number;
  operation: 'add' | 'subtract' | 'multiply';
}

// Export all interfaces for use in other modules
export type {
  ProductCatalog,
  ProductCategory,
  Product,
  ProductVariant,
  VariantOption,
  ProductPricing,
  Money,
  Currency,
  PriceDiscount,
  DiscountCondition,
  PriceTier,
  Brand,
  SocialMediaLinks,
  ImageAsset,
  ImageVariant,
  VideoAsset,
  DocumentAsset,
  InventoryInfo,
  WarehouseLocation,
  Address,
  GeoCoordinates,
  SupplierInfo,
  ContactInformation,
  PersonContact,
  ShippingInfo,
  PhysicalDimensions,
  ShippingClass,
  ShippingRestriction,
  ProductAttribute,
  AttributeGroup,
  FileAsset,
  ProductReview,
  ReviewResponse,
  SeoMetadata,
  OpenGraphData,
  TwitterCardData,
  StructuredData,
  FilterOptions,
  PriceRangeFilter,
  CategoryFilter,
  BrandFilter,
  AttributeFilter,
  FilterOption,
  AvailabilityFilter,
  RatingFilter,
  CustomFilter,
  SearchConfiguration,
  SearchEngine,
  AuthenticationConfig,
  PerformanceConfig,
  IndexingConfiguration,
  CronSchedule,
  IndexedField,
  DataTransform,
  IndexingFilter,
  SynonymGroup,
  FieldBoost,
  FacetConfiguration,
  AutocompleteConfiguration,
  PopularQuery,
  RecommendationEngine,
  RecommendationAlgorithm,
  RecommendationRule,
  RuleCondition,
  RuleAction,
  PersonalizationConfig,
  TrackingMethod,
  CustomerSegment,
  SegmentCriteria,
  SegmentRecommendation,
  ColdStartStrategy,
  ABTestConfiguration,
  ABTest,
  TestVariant,
  TestMetric,
  TrafficAllocation,
  TaxInformation,
  TaxExemption,
  TaxRule,
  PriceModifier
};