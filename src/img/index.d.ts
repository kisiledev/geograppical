declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
