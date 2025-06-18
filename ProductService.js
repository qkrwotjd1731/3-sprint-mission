import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://panda-market-api-crud.vercel.app',
});

export async function getProductList(page=1, pageSize=10, keyword='') {
  try {
    const res = await instance.get('/products',{ params: { page, pageSize, keyword } });
    return res. data;
  } catch (err) {
    console.log(`Error T.T: ${err.response.status} ${err.response.statusText}`);
  }
}

export async function getProduct(id) {
  try {
    const res = await instance.get(`/products/${id}`);
    return res. data;
  } catch (err) {
    console.log(`Error T.T: ${err.response.status} ${err.response.statusText}`);
  }
}

export async function createProduct(productData) {
  try {
    // 구조 분해를 통해 request body에 속성 할당
    const { name, description, price, tags, images } = productData;
    const requestBody = {
      name,
      description,
      price,
      tags,
      images
    };

    const res = await instance.post('/products',requestBody);
    return res. data;
  } catch (err) {
    console.log(`Error T.T: ${err.response.status} ${err.response.statusText}`);
  }
}

export async function patchProduct(id, productData) {
  try {
    const res = await instance.patch(`/products/${id}`,productData);
    return res. data;
  } catch (err) {
    console.log(`Error T.T: ${err.response.status} ${err.response.statusText}`);
  }
}

export async function deleteProduct(id) {
  try {
    const res = await instance.delete(`/products/${id}`);
    return res. data;
  } catch (err) {
    console.log(`Error T.T: ${err.response.status} ${err.response.statusText}`);
  }
}
