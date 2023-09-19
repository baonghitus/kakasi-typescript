# kakasi typescript
Kakasi Japanese Transliteration for Node.js

## How to install
```bash
git clone https://github.com/baonghitus/kakasi-typescript.git
```
## custom from
```bash
git clone https://github.com/loretoparisi/kakasi.js.git 
```

## How to use kakasi.js
### Transliterate
To transliterate a sentence use the `transliterate` api.
```typescript
var kk = new Kakasi();
kk.transliterate( "退屈であくびばっかしていた毎日" )
.then(results => {
    console.log("----------\n%s\n----------",results);
})
.catch(error => {
    console.error(error);
});
```

this will end up in `taikutsu deakubibakkashiteita mainichi`

