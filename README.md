# Milagres que Andam — Site premium otimizado

Projeto reorganizado em pastas, com HTML, CSS, JavaScript e imagens separados para facilitar manutenção e reduzir o peso do carregamento.

## Estrutura

```txt
milagres_que_andam_site_premium/
├── index.html              # Redirecionamento rápido para /html/index.html
├── html/
│   └── index.html          # Página principal do site
├── css/
│   └── styles.css          # Estilos originais + transições/animações premium
├── js/
│   └── app.js              # WhatsApp, formulário e microinterações premium
└── assets/
    └── images/             # Imagens WebP otimizadas
```

## O que foi aplicado

- Imagens enviadas adicionadas em cards de benefícios, serviços, jornada, tratamento, processo e contato sem alterar a estrutura principal do site.
- Transições premium de entrada, brilho, hover, tilt suave e parallax leve nas imagens dos cards.
- Imagens convertidas para WebP e redimensionadas para reduzir peso.
- `loading="lazy"`, `decoding="async"`, `srcset` e `preload` do hero para melhor performance.
- HTML deixou de carregar imagens em base64, deixando a página muito mais leve.

## Como editar o WhatsApp

Abra `js/app.js` e altere:

```js
const WHATSAPP_NUMERO = "558199910958";
```

## Como abrir

Abra `index.html` na raiz do projeto ou diretamente `html/index.html`.

## Observação de performance

As imagens grandes originais não foram mantidas dentro do pacote final; somente as versões otimizadas em WebP foram incluídas.
