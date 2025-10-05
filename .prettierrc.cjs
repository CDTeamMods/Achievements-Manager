module.exports = {
  // Configurações básicas
  semi: true,
  trailingComma: "es5",
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  
  // Quebra de linha
  printWidth: 100,
  endOfLine: "lf",
  
  // Formatação específica
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "avoid",
  
  // Arquivos específicos
  overrides: [
    {
      files: "*.json",
      options: {
        singleQuote: false,
        trailingComma: "none"
      }
    },
    {
      files: "*.css",
      options: {
        singleQuote: false
      }
    }
  ]
};