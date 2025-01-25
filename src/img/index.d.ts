declare module "*.png" {
  const value: string;
  export = value;
}

declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
