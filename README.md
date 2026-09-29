# React: datan hakeminen APIsta

## Tavoite

Harjoituksen jälkeen osaat:

- käynnistää HTTP-pyynnön React-komponentin latautuessa `useEffect`-hookilla
- käyttää `fetch`-funktiota ja `async/await`-syntaksia
- tallentaa APIsta saadun datan komponentin tilaan
- näyttää lataus- ja virhetilan käyttöliittymässä
- renderöidä APIsta saadun taulukon olemassa olevalla `Post`-komponentilla

Harjoituksessa käytetään DummyJSON-palvelun osoitetta:

`https://dummyjson.com/posts`

Vastaus sisältää `posts`-taulukon:

```js
{
  posts: [
    {
      id: 1,
      title: '...',
      body: '...',
      tags: ['...', '...'],
      reactions: { likes: 10, dislikes: 2 },
      views: 100,
      userId: 1
    }
  ],
  total: 251,
  skip: 0,
  limit: 30
}
```

## Tehtävä

Muokkaa vain tiedostoa `src/PostList.jsx`. `Post.jsx` on valmis komponentti, jota käytetään yhden postauksen näyttämiseen.

1. Tuo Reactista `useEffect` ja `useState`.
2. Korvaa kovakoodattu `posts`-taulukko tilamuuttujalla. Alkuarvo on tyhjä taulukko.
3. Tee lisäksi tila lataukselle. Latauksen alkuarvo on `true`.
4. Tee lisäksi tila virheviestille. Virheviestin alkuarvo on tyhjä merkkijono.
5. Tee `useEffect`, jonka riippuvuustaulukko on tyhjä (`[]`), jotta tilan päivitykset eivät käynnistä hakua uudelleen. Katso alta kehitystilan `StrictMode`-huomautus.
6. Tee `useEffect`-funktion sisälle `async`-funktio, joka hakee datan osoitteesta `https://dummyjson.com/posts`, ja kutsu sitä efektin sisällä.
7. Tarkista `response.ok`. Jos vastaus ei ole onnistunut, aiheuta virhe esimerkiksi `throw new Error(...)` -komennolla.
8. Muunna vastaus JSON-muotoon komennolla `await response.json()` ja tallenna `data.posts` postauksien tilaan.
9. Jos haku epäonnistuu, näytä virheviesti täsmälleen muodossa `Postausten lataaminen epäonnistui.`
10. Kun pyyntö on päättynyt, aseta lataustila arvoon `false`.
11. Näytä latauksen aikana teksti `Ladataan postauksia...`.
12. Näytä virheviesti elementissä, jolla on `role="alert"`.
13. Näytä postauslista vasta, kun lataus on päättynyt eikä virhettä ole.
14. Säilytä `Post`-komponentin käyttö: jokainen postaus välitetään sille `post`-propsina.

### Rakennevihje

Voit käyttää seuraavaa rakennetta. Täydennä kommenttien kohdalle tarvittavat komennot:

```js
useEffect(() => {
  async function loadSomething() {
    try {
      // fetch
      // response.ok
      // response.json()
      // setState(...)
    } catch (err) {
      // virhetila
    } finally {
      // lataustila pois
    }
  }

  loadSomething();
}, []);
```

`useEffect`-funktion callback ei itse ole `async`, vaan asynkroninen haku tehdään sen sisällä määritellyssä funktiossa. `catch` käsittelee virheen ja `finally` päättää lataustilan sekä onnistumisen että virheen jälkeen.

### Miksi selaimessa voi näkyä kaksi pyyntöä?

Tiedosto `src/main.jsx` käyttää Reactin `StrictMode`-tilaa. Kehitystilassa React suorittaa efektin alussa ylimääräisen setup–cleanup-kierroksen, joten selaimen Network-välilehdellä voi näkyä kaksi hakupyyntöä myös tyhjällä riippuvuustaulukolla (`[]`). Tämä on odotettua kehitystilassa eikä tarkoita, että ratkaisu olisi väärä. Säilytä `StrictMode` ennallaan.

Automaattitestit renderöivät `PostList`-komponentin ilman `StrictMode`-tilaa, joten niissä odotetaan yhtä `fetch`-kutsua. Lisätietoa: [Reactin StrictMode-dokumentaatio](https://react.dev/reference/react/StrictMode).

## Käynnistys

Tarvitset Node.js:n ja npm:n. Projektin Vite 7 edellyttää Node.js-versiota 20.19+ tai 22.12+; esimerkiksi Node.js 24 sopii. Tarkista asennetut versiot komennoilla `node --version` ja `npm --version`.

Avaa projektikansio editorissa ja terminaali samaan kansioon, jossa `package.json` sijaitsee. Suorita kaikki alla olevat komennot tässä kansiossa.

Asenna riippuvuudet ennen ensimmäistä käynnistystä:

```bash
npm install
```

Käynnistä sovellus:

```bash
npm run dev
```

Avaa selaimessa terminaalin tulostama paikallinen osoite (yleensä `http://localhost:5173`). Jätä kehityspalvelin käyntiin. Aluksi sivulla näkyy kaksi kovakoodattua esimerkkipostausta; tämä on pohjan tarkoitettu lähtötilanne. Valmis ratkaisu tarvitsee verkkoyhteyden DummyJSON-palveluun.

## Testit

Avaa toinen terminaali samaan projektikansioon, jos kehityspalvelin on käynnissä. Suorita automaattitestit:

```bash
npm test
```

Testien kuuluu epäonnistua ennen tehtävän toteuttamista, koska pohjassa ei vielä ole API-hakua eikä lataus- ja virhetiloja. `npm test` suorittaa testit kerran ja päättyy. Suorita komento uudelleen muutosten jälkeen tai käytä komentoa `npm run test:watch`, joka suorittaa testit uudelleen tiedostojen muuttuessa.

Testit korvaavat `fetch`-funktion testivastauksilla eivätkä ota yhteyttä oikeaan APIin. Kehityspalvelimen ei tarvitse olla käynnissä testejä varten. Voit pysäyttää kehityspalvelimen tai testien seurantatilan näppäinyhdistelmällä `Ctrl+C`.

Testit tarkistavat seuraavat asiat:

- lataustila näkyy pyynnön aikana
- `fetch` käyttää oikeaa URL-osoitetta
- APIsta saadut postaukset näkyvät käyttöliittymässä
- HTTP-virhe näytetään käyttäjälle
- verkkovirhe näytetään käyttäjälle

## Valmis, kun

- Olet toteuttanut kaikki Tehtävä-kohdan vaatimukset ja säilyttänyt `Post`-komponentin käytön.
- `npm test` suorittaa kaikki testit onnistuneesti.
- Selaimessa näkyvät DummyJSON-palvelusta haetut postaukset kovakoodattujen esimerkkien sijaan.

Testit tarkistavat keskeiset tilanteet, mutta eivät kaikkia toteutuksen yksityiskohtia. Tarkista siksi myös tehtävän vaatimukset ja sovelluksen toiminta selaimessa.
