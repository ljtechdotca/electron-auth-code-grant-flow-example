# Electron TypeScript Webpack React

This project was bootstrapped using the [Forge Electron (TypeScript + Webpack) template](https://www.electronforge.io/templates/typescript-+-webpack-template) and integrated with React and Sass.

## CORS

Having CORS issues? Find and update the plugins > @electron-forge/plugin-webpack field in the package.json config:
```jsonc
    // ...
      "plugins": [
        [
          "@electron-forge/plugin-webpack",
          {
            "devContentSecurityPolicy": "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-eval' 'unsafe-inline' data:; img-src 'self' https://i.kym-cdn.com/entries/icons/original/000/015/878/thatsnoneofmy.jpg",
            // ...
          }
        ]
      ]
    // ...
```