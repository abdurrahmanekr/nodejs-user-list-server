# Nodejs User List Server
Bu proje [cdn-on-gitserver](https://www.npmjs.com/package/cdn-on-gitserver) kullanımına örnek olması için yazılmıştır.

## Özet
cdn-on-gitserver, GitLab'a bir dosyayı commit olarak atmak için kullanılır. Bu projede kullanıcı listesi ve kullanıcıların resimleri tutulur.

Kullanıcılar arkaplanda profil resimlerini GitLab'a yüklerler ve getirmek istediklerinde yine GitLab üzerinden getirirler.

## Kurulum
Projede GitLab hesabı kullanıldığından bir GitLab projesine ve erişim anahtarına gerek duyulur.

GitLab üzerinden bir proje oluşturun. Sonra bu projenin `Project ID` değerini kaydedin.

### GitLab erişim anahtarı
GitLab erişim anahtarını [https://gitlab.com/profile/personal\_access\_tokens](https://gitlab.com/profile/personal_access_tokens) adresinden `Scopes` altındaki **api** değerini seçin ve oluşturup kaydedin. (Not: Sayfayı yenilediğinizde o anahtarı tekrar elde edemezsiniz.)

Anahtar buna benzeyecektir: `5R5kaQ-5e8PCTKrrdtv8` (Not: bu örnektir)

### Anahtar ve Project ID
Bunları elde ettikten sonra [index.js](./index.js) dosyasının içindeki `<sizin gitlab anahtarınız>` değerinin yenine GitLab erişim anahtarını, `<projenizin idsi>` yerine Project ID değerini yazıp kaydediniz.

### Veritabanı
Veritabanı için postgresql kullanılmıştır. Ayarları [database.js](./database.js) dosyasından değiştirebilirsiniz.

## Başlatmak için
Kurulumu yaptıktan sonra aşağıdaki komutu kullanarak başlatabilirsiniz.
```
npm start
```

## Denemek için
Aşağıdaki postman koleksiyonunda tüm istekler vardır.

[Postman Link](https://www.getpostman.com/collections/fd293d7fd271263593a4)

POST