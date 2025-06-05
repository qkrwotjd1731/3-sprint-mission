import { getProductList, getProduct, createProduct, patchProduct, deleteProduct } from "./ProductService.js";
import { getArticleList, getArticle, createArticle, patchArticle, deleteArticle } from "./ArticleService.js";

class Product {
  constructor(name, description, price, tags, images, favoriteCount = 0) {
    this._name = name;  // 상품명
    this._description = description;  // 상품 설명
    this._price = price;  // 판매 가격
    this._tags = tags;  // 해시태그 배열
    this._images = images;  // 이미지 배열
    this._favoriteCount = favoriteCount;  // 찜하기 수
  }

  // 캡슐화 get/set
  get name() {
    return this._name;
  }
  
  set name(value) {
    const isString = typeof value === 'string'; // 문자열인지 판단
    const isLengthValid = value.length >= 1 && value.length <= 30; // 1자 이상, 30자 이하
    const noSpecialChars = /^[가-힣a-zA-Z0-9\s]+$/.test(value) // 한글, 영문, 숫자, 공백만 허용

    if (isString && isLengthValid && noSpecialChars) {
      this._name = value;
    } else {
      console.log('상품명은 1~30자의 특수문자를 제외한 문자열이어야 합니다.');
    }
  }

  get description() {
    return this._description;
  }

  set description(value) {
    if (typeof value === 'string') {
      this._description = value;
    } else {
      console.log('상품 설명은 문자열이어야 합니다.');
    }
  }

  get price() {
    return this._price;
  }

  set price(value) {
    const isNumber = typeof value === 'number'; // 숫자인지 판단
    const isValid = value >=0 && value <= 9999999; //0원 이상, 9999999원 이하

    if (isNumber && isValid) {
      this._price = value;
    } else {
      console.log('판매 가격은 0 이상 9999999 이하의 숫자여야 합니다.');
    }
  }

  get tags() {
    return this._tags;
  }

  set tags(value) {
    if (Array.isArray(value)) {
      let isValid = true;

      value.forEach((tag) => {
        if (typeof tag !== string) {  // starsWith 고려 가능
          isValid = false;
        } else if (tag[0] !== '#') {
          tag = '#' + tag;
        }
      })
    }
    
    if (isValid) {
      this._tags = value;
    } else {
      console.log('각 해시태그는 문자열이어야 합니다.');
    }
  }

  get images() {
    return this._images;
  }

  set images(value) {
    if (!Array.isArray(value)) {
      console.log('배열이어야 합니다.');
      return;
    }

    let allValid = true;

    value.forEach((url) => {
      if(!(typeof url === 'string' && url.startsWith('http'))) {
        allValid = false;
      }
    });

    if (allValid) {
      this._images = value;
    } else {
      console.log('배열 안의 모든 항목은 유효한 URL이어야 합니다.');
    }
  }

  get favoriteCount() {
    return this._favoriteCount;
  }

  set favoriteCount(value) {
    const isNumber = typeof value === 'number'; // 숫자인지 판단
    const isValid = value >=0 && value <= 999; // 0개 이상, 999개 이하

    if (isNumber && isValid) {
      this._favoriteCount = value;
    } else {
      console.log('찜하기 수는 0 이상 999 이하의 숫자여야 합니다.');
    }
  }

  // 찜하기 수 1 증가시키기
  favorite() {
    this.favoriteCount++;
  }
}

class ElectronicProduct extends Product {
  constructor(name, description, price, tags, images, favoriteCount, manufacturer) {
    super(name, description, price, tags, images, favoriteCount);
    this._manufacturer = manufacturer;  // 제조사
  }

  // 캡슐화 get/set
  get manufacturer() {
    return this._manufacturer;
  }

  set manufacturer(value) {
    if (typeof value === 'string') {
      this._manufacturer = value;
    } else {
      console.log('제조사 이름은 문자열이어야 합니다.');
    }
  }
}

class Article {
  constructor(title, content, writer, likeCount = 0) {
    this._title = title;  // 제목
    this._content = content;  // 내용
    this._writer = writer;  // 작성자
    this._likeCount = likeCount;  // 좋아요 수
    this._createdAt = new Date(); // 생성일자
  }

  // 캡슐화 get/set
   get title() {
    return this._title;
  }

  set title(value) {
    if (typeof value === 'string') {
      this._title = value;
    } else {
      console.log('제목은 문자열이어야 합니다.');
    }
  }

  get content() {
    return this._content;
  }

  set content(value) {
    if (typeof value === 'string') {
      this._content = value;
    } else {
      console.log('내용은 문자열이어야 합니다.');
    }
  }

  get writer() {
    return this._writer;
  }

  set writer(value) {
    if (typeof value === 'string') {
      this._writer = value;
    } else {
      console.log('작성자는 문자열이어야 합니다.');
    }
  }

  get likeCount() {
    return this._likeCount;
  }

  set likeCount(value) {
    const isNumber = typeof value === 'number'; // 숫자인지 판단
    const isValid = value >=0 && value <= 999; // 0개 이상, 999개 이하

    if (isNumber && isValid) {
      this._likeCount = value;
    } else {
      console.log('좋아요 수는 0 이상 999 이하의 숫자여야 합니다.');
    }
  }

  // 좋아요 수 1 증가시키기
  like() {
    this.likeCount++;
  }
}

// ---Product Test Code---
//   const createProductResult = await createProduct({
//   "name": "헤드셋",
//   "description": "스피커,마이크 가능",
//   "price": 30000,
//   "tags": ["전자제품"],
//   "images": ["https://example.com/..."],
// });
// const patchProductResult = await patchProduct(903, {
//   "name": "노트북",
//   "description": "휴대가능",
//   "price": 1100000,
//   "tags": ["전자제품"],
//   "images": ["https://example.com/..."],
// })
// const deleteProductResult = await deleteProduct(902);
// const getProductResult = await getProduct(901);
const productData = await getProductList();

// console.log('createProduct 결과: ', createProductResult);
// console.log('patchProduct 결과: ', patchProductResult);
// console.log('deleteProduct 결과: ', deleteProductResult);
// console.log('getProduct 결과: ', getProductResult);
console.log('-------');
const products = [];

// tag에 '#전자제품'이 포함되어있는지 확인하고 맞는 클래스 생성
productData.list.forEach((product) => {
  if (product.tags.includes('전자제품')) {
    products.push(new ElectronicProduct(
      product.name,
      product.description,
      product.price,
      product.tags,
      product.images,
      product.favoriteCount,
      product.manufacturer
    ));
  } else {
    products.push(new Product(
      product.name,
      product.description,
      product.price,
      product.tags,
      product.images,
      product.favoriteCount
    ));
  }
});
console.log('Product Body: ', productData);
// console.log('Products 배열: ', products);
console.log('-------');

// ---Article Test Code---
// const createArticleResult = await createArticle({
//   "title": "님블뉴런",
//   "content": "세계 최고의 게임회사",
//   "image": "https://example.com/..."
// });
// const patchArticleResult = await patchArticle(1357, {
//   "title": "님블뉴런",
//   "content": "세계 최악의 게임회사",
//   "image": "https://example.com/..."
// });
// const deleteArticleResult = await deleteArticle(1356);
// const getArticleResult = await getArticle(1355);
// const articleData = await getArticleList();

// console.log('createArticle 결과: ', createArticleResult);
// console.log('patchArticle 결과: ', patchArticleResult);
// console.log('deleteArticle 결과: ', deleteArticleResult);
// console.log('getArticle 결과: ', getArticleResult);
// console.log('-------');
// console.log('getArticleList 결과: ', articleData);