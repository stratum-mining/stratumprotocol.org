export interface SpecificationSection {
  title: string;
  slug: string;
  content: string;
  html?: string;
}

export interface SpecificationObject {
  [key: string]: SpecificationSection;
}

export interface SpecificationData {
  sections: SpecificationSection[];
}