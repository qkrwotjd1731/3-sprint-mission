// 스프린트 미션 12 - 자바스크립트로 정렬 알고리즘 구현하기

/**
 * 선택 정렬 (Selection sort)
 * @param {number[]} numArr 정렬할 숫자형 배열
 * @returns {void} 해당 배열을 직접 수정하므로 반환값 없음
 */
function selectionSort(numArr) {
  for (let i = 0; i < numArr.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < numArr.length; j++) {
      if (numArr[j] < numArr[minIndex]) {
        minIndex = j;
      }
    }
    [numArr[i], numArr[minIndex]] = [numArr[minIndex], numArr[i]];
  }
}

/**
 * 삽입 정렬 (Insertion sort)
 * @param {number[]} numArr 정렬할 숫자형 배열
 * @returns {void} 해당 배열을 직접 수정하므로 반환값 없음
 */
function insertionSort(numArr) {
  for (let i = 1; i < numArr.length; i++) {
    let key = numArr[i];
    let j = i - 1;
    while (j >= 0 && key < numArr[j]) {
      numArr[j + 1] = numArr[j];
      j--;
    }
    numArr[j + 1] = key;
  }
}

/**
 * 병합 정렬에서 사용되는 partition 함수
 * @param {number[]} leftArr 병합할 왼쪽 숫자형 배열
 * @param {number[]} rightArr 병합할 오른쪽 숫자형 배열
 * @returns {number[]} 병합 정렬된 새로운 숫자형 배열
 */
function mergeSortPartition(leftArr, rightArr) {
  let i = 0;
  let j = 0;
  let mergedArr = [];

  // leftArr와 rightArr를 돌면서 mergedArr에 정렬
  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] < rightArr[j]) {
      mergedArr.push(leftArr[i]);
      i++;
    } else {
      mergedArr.push(rightArr[j]);
      j++;
    }
  }

  // 각 배열에 남은 항목이 있으면 정렬된 배열에 추가
  if (i < leftArr.length) {
    mergedArr.push(...leftArr.slice(i));
  } else if (j < rightArr.length) {
    mergedArr.push(...rightArr.slice(j));
  }

  return mergedArr;
}

/**
 * 병합 정렬 (Merge sort)
 * @param {number[]} numArr 정렬할 숫자형 배열
 * @returns {number[]} 병합 정렬된 새로운 숫자형 배열
 */
function mergeSort(numArr) {
  // base case
  if (numArr.length < 2) {
    return numArr;
  }

  // numArr를 반씩 나눔 (divide)
  const leftHalf = numArr.slice(0, numArr.length / 2);
  const rightHalf = numArr.slice(numArr.length / 2);

  // mergeSort 함수를 재귀적으로 호출하여 부분 문제 해결(conquer)하고,
  // merge 함수로 정렬된 두 배열을 합쳐(combine)준다
  return mergeSortPartition(mergeSort(leftHalf), mergeSort(rightHalf));
}

/**
 * 퀵 정렬에서 사용되는 partition 함수
 * @param {number[]} numArr 정렬할 숫자형 배열
 * @param {number} start 정렬시킬 범위의 시작 인덱스
 * @param {number} end 정렬시킬 범위의 끝 인덱스
 * @returns {number} pivot의 최종 인덱스
 */
function quickSortPartition(numArr, start, end) {
  // 배열 값 확인과 기준점 이하 값들의 위치 확인을 위한 변수 정의
  let i = start;
  let b = start;
  let p = end;

  // 범위 안의 모든 값들을 볼 때까지 반복문을 돌린다
  while (i < p) {
    // i 인덱스의 값이 기준점보다 작으면 i와 b 인덱스에 있는 값들을 교환하고 b를 1 증가 시킨다
    if (numArr[i] <= numArr[p]) {
      [numArr[i], numArr[b]] = [numArr[b], numArr[i]];
      b++;
    }
    i++;
  }

  // b와 기준점인 p 인덱스에 있는 값들을 바꿔준다
  [numArr[b], numArr[p]] = [numArr[p], numArr[b]];
  p = b;

  // pivot의 최종 인덱스를 리턴해준다
  return p;
}

/**
 * 퀵 정렬 (Quick sort)
 * @param {number[]} numArr 정렬할 숫자형 배열
 * @param {number} start 정렬시킬 범위의 시작 인덱스
 * @param {number} end 정렬시킬 범위의 끝 인덱스
 * @returns {void} 해당 배열을 직접 수정하므로 반환값 없음
 */
function quickSort(numArr, start = 0, end = numArr.length - 1) {
  // base case
  if (end - start < 1) {
    return;
  }

  // partition 이후 pivot의 인덱스를 리턴받는다.
  const pivot = quickSortPartition(numArr, start, end);

  // pivot의 왼쪽 부분 정렬
  quickSort(numArr, start, pivot - 1);

  // pivot의 오른쪽 부분 정렬
  quickSort(numArr, pivot + 1, end);
}

// ===============================================
// 테스트 코드 (Test code)
// ===============================================

console.log("선택 정렬 테스트 코드");
const nums1 = [9, 4, 2, 3, 1, 8, 1];
console.log("정렬 전:", nums1); // [9, 4, 2, 3, 1, 8, 1]
selectionSort(nums1);
console.log("정렬 후:", nums1); // [1, 1, 2, 3, 4, 8, 9]

console.log("삽입 정렬 테스트 코드");
const nums2 = [9, 4, 2, 3, 1, 8, 1];
console.log("정렬 전:", nums2); // [9, 4, 2, 3, 1, 8, 1]
insertionSort(nums2);
console.log("정렬 후:", nums2); // [1, 1, 2, 3, 4, 8, 9]

console.log("병합 정렬 테스트 코드");
const nums3 = [28, 13, 9, 30, 1, 48, 5, 7, 15];
console.log("정렬 전:", nums3); // [28, 13, 9, 30, 1, 48, 5, 7, 15]
const sortedNums3 = mergeSort(nums3);
console.log("정렬 후:", sortedNums3); // [1, 5, 7, 9, 13, 15, 28, 30, 48]

console.log("퀵 정렬 테스트 코드");
const nums4 = [28, 13, 9, 30, 1, 48, 5, 7, 15];
console.log("정렬 전:", nums4); // [28, 13, 9, 30, 1, 48, 5, 7, 15]
quickSort(nums4, 0, nums4.length - 1);
console.log("정렬 후:", nums4); // [1, 5, 7, 9, 13, 15, 28, 30, 48]
