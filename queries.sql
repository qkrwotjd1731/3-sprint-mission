/*
  다음 경우들에 대해 총 14개의 SQL 쿼리를 작성해 주세요.
  예시로 값이 필요한 경우 적당한 값으로 채워넣어서 작성하면 됩니다. 
*/

/*
  1. 내 정보 업데이트 하기
  - 닉네임을 "test"로 업데이트
  - 현재 로그인한 유저 id가 1이라고 가정
*/

UPDATE users
SET nickname = 'test',
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

/*
  2. 내가 생성한 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/

SELECT * FROM products
WHERE user_id = 1
ORDER BY created_at DESC
LIMIT 10 OFFSET (3 - 1) * 10;

/*
  3. 내가 생성한 상품의 총 개수
*/

SELECT COUNT(*) FROM products
WHERE user_id = 1;

/*
  4. 내가 좋아요 누른 상품 조회
  - 현재 로그인한 유저 id가 1이라고 가정
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 3번째 페이지
*/

SELECT p.* FROM products p
JOIN product_likes pl ON p.id = pl.product_id
WHERE pl.user_id = 1
ORDER BY p.created_at DESC
LIMIT 10 OFFSET (3 - 1) * 10;

/*
  5. 내가 좋아요 누른 상품의 총 개수
*/

SELECT COUNT(*) FROM product_likes
WHERE user_id = 1;

/*
  6. 상품 생성
  - 현재 로그인한 유저 id가 1이라고 가정
*/

INSERT INTO products (user_id, name, description, price, image_url, created_at, updated_at)
VALUES (1, '새로운 상품명', '10자 이상의 상품 설명입니다.', 10000, 'https://example.com/image.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

/*
  7. 상품 목록 조회
  - "test" 로 검색
  - 최신 순으로 정렬
  - 10개씩 페이지네이션, 1번째 페이지
  - 각 상품의 좋아요 개수를 포함해서 조회하기
*/

SELECT
    p.id,
    p.user_id,
    p.name,
    p.description,
    p.price,
    p.image_url,
    p.created_at,
    p.updated_at,
    COUNT(pl.id) as like_count
FROM products p
LEFT JOIN product_likes pl ON p.id = pl.product_id
WHERE p.name LIKE '%test%' OR p.description LIKE '%test%'
GROUP BY p.id, p.user_id, p.name, p.description, p.price, p.image_url, p.created_at, p.updated_at
ORDER BY p.created_at DESC
LIMIT 10 OFFSET (1 - 1) * 10;

/*
  8. 상품 상세 조회
  - 1번 상품 조회
*/

SELECT
    p.id,
    p.user_id,
    p.name,
    p.description,
    p.price,
    p.image_url,
    p.created_at,
    p.updated_at,
    u.nickname,
    COUNT(pl.id) as like_count
FROM products p
JOIN users u ON p.user_id = u.id
LEFT JOIN product_likes pl ON p.id = pl.product_id
WHERE p.id = 1
GROUP BY p.id, p.user_id, p.name, p.description, p.price, p.image_url, p.created_at, p.updated_at, u.nickname;

/*
  9. 상품 수정
  - 1번 상품 수정
*/

UPDATE products
SET name = '수정된 상품명',
    description = '10자 이상의 수정된 상품 설명',
    price = 15000,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

/*
  10. 상품 삭제
  - 1번 상품 삭제
*/

DELETE FROM products WHERE id = 1;

/*
  11. 상품 좋아요
  - 1번 유저가 2번 상품 좋아요
*/

INSERT INTO product_likes (user_id, product_id, created_at)
VALUES (1, 2, CURRENT_TIMESTAMP);

/*
  12. 상품 좋아요 취소
  - 1번 유저가 2번 상품 좋아요 취소
*/

DELETE FROM product_likes
WHERE user_id = 1 AND product_id = 2;

/*
  13. 상품 댓글 작성
  - 1번 유저가 2번 상품에 댓글 작성
*/

INSERT INTO product_comments (user_id, product_id, content, created_at)
VALUES (1, 2, '좋은 상품이네요!', CURRENT_TIMESTAMP);

/*
  14. 상품 댓글 조회
  - 1번 상품에 달린 댓글 목록 조회
  - 최신 순으로 정렬
  - 댓글 날짜 2025-03-25 기준으로 커서 페이지네이션
  - 10개씩 페이지네이션
*/

SELECT pc.*, u.nickname
FROM product_comments pc
JOIN users u ON pc.user_id = u.id
WHERE pc.product_id = 1
  AND pc.created_at < '2025-03-25 00:00:00'
ORDER BY pc.created_at DESC
LIMIT 10;