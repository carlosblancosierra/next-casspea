// Base types
export interface LayerColor {
  name: string;
  slug: string;
  hex_code: string;
}

export interface LayerTypeColor extends LayerColor {
  top_image: string;
  side_image: string;
}

export interface LayerType {
  name: string;
  colors: LayerTypeColor[];
}

// Template related types
export interface TemplateLayerSlot {
  layer_type: LayerType;
  name: string | null;
  order: number;
}

export interface ChocolateTemplateBase {
  title: string;
  slug: string;
}

export interface ChocolateTemplateDetail extends ChocolateTemplateBase {
  layers: TemplateLayerSlot[];
}

// User design related types
export interface ChocolateLayer {
  layer_type: LayerType;
  color: LayerColor;
  top_image: string;
  side_image: string;
}

export interface UserChosenLayer {
  chocolate_layer: ChocolateLayer;
  order: number;
}

export interface UserChocolateDesign {
  id: number;
  user: number | null;
  template: ChocolateTemplateDetail;
  chosen_layers: UserChosenLayer[];
  active: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface TemplateListResponse {
  templates: ChocolateTemplateBase[];
}

export interface TemplateDetailResponse {
  template: ChocolateTemplateDetail;
}

// Example usage for API calls:
export type GetTemplateListParams = void;
export type GetTemplateDetailParams = { slug: string };