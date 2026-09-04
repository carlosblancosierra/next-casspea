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
  // Colors always come from LayerType.colors, which carry the image paths.
  color: LayerTypeColor;
  top_image: string;
  side_image: string;
}

export interface UserChosenLayer {
  chocolate_layer: ChocolateLayer;
  order: number;
}

