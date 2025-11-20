1. Tworzymy folder na nasz projekt:
```bash
mkdir ts-node-express
```
2. Wchodzimy do folderu i inicjalizujemy projekt:
```bash
cd ts-node-express/
npm init -y
```
3. Instalujemy paczki:a
```bash
npm i express dotenv ts-node
```
```bash
4. npm i -D typescript @types/express @types/node
```
```bash
5. npx tsc --init
```

```
6. npm i -D nodemon concurrently
```
7.npm i body-parser
```
8. tak wygląda tsconfig.json

{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
     "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig/module
    "module": "nodenext",
    "target": "esnext",
    // For nodejs:
    // "lib": ["esnext"],
     "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
  }
}



trzeba zmienić na 

{
  "compilerOptions": {
    // File Layout
    "outDir": "./dist",
    
    // Environment Settings
    "module": "CommonJS",
    "target": "ES2022",
    "lib": ["ES2022"],
    "types": ["node"],
    
    // Module Resolution
    "moduleResolution": "node",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    
    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "removeComments": false,
    
    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    
    // Style Options
    "forceConsistentCasingInFileNames": true,
    
    // Recommended Options
    "strict": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    
    // Additional Quality Checks
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": [
    "src/**/*",
    "index.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}

npm i -D nodemon concurrently

  "scripts": {
    "dev": "nodemon index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "clean": "rm -rf dist"
  },# NodeFromScratch
# NodeFromScratch
# NodeFromScratch
# NodeFromScratch
# NodeFromScratch
# NodeFromScratch
