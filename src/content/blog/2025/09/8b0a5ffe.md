---
title: 'U1配信用に画面を作った'
pubDate: 2025-09-08
tags: ['Unrailed', 'OBS']
image: '/cover/2025/2025-09-08-20-41-36.png'
---

全実績解除を配信でやりたいので、実績の進捗がわかる配信画面を作った。ブラウザソースで進捗部分を映し、インタラクト機能で操作する。

![](@/assets/2025/09/e87679d4-6d45-4e08-99cb-462db764adf4.png)

`n/52` の部分は実績の解放数に合わせて増える。

![](@/assets/2025/09/14b14927-709b-47e4-b097-11736161fb60.png)

ホイールの回転によって操作できるので、フォーカスを奪うことがない。Unrailed!の操作をしたまま片手でカウンターの数字を増やせる。

```js
image.addEventListener('wheel', (event) => {
  event.preventDefault();

  if (event.deltaY < 0) {
    image.classList.add('is-unlocked');
  } else if (event.deltaY > 0) {
    image.classList.remove('is-unlocked');
  }
});
```
