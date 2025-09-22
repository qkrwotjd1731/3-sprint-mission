// Socket.IO 모킹 - 유닛 테스트에서 실제 서버 실행 방지
export const io = {
  to: jest.fn().mockReturnThis(),
  emit: jest.fn(),
  use: jest.fn(),
  on: jest.fn(),
};
