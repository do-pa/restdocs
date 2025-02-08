// test/integration.test.js
const request = require('supertest');
const app = require('../app');

describe('API 통합 테스트', () => {

  // 테스트 간 상태 공유 문제를 막기 위해, 각 테스트 전 상태를 초기화하는 로직을 추가할 수 있습니다.
  // (예제에서는 메모리 배열 users를 직접 초기화하지 않았으므로 테스트 순서에 주의해야 합니다.)

  describe('GET /api/v1/users', () => {
    /**
     * @responseField id number required    각 사용자 객체의 사용자 ID
     * @responseField name string required  각 사용자 객체의 사용자 이름
     * @responseField email string optional 각 사용자 객체의 사용자 이메일
     *
     * 설명:
     * 초기 상태에서는 사용자가 없으므로 빈 배열을 반환해야 합니다.
     */
    it('초기에는 빈 배열을 반환해야 한다', async () => {
      const res = await request(app).get('/api/v1/users');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe('POST /api/v1/users', () => {
    /**
     * 정상적인 사용자 생성 요청 테스트
     *
     * 요청 데이터:
     *  - name: string (required)
     *  - email: string (optional)
     *
     * 성공 응답:
     *   @responseField id number required    생성된 사용자 객체의 ID
     *   @responseField name string required  생성된 사용자 객체의 이름
     *   @responseField email string optional 생성된 사용자 객체의 이메일
     */
    it('정상적인 사용자 생성 요청시 201 상태 코드와 생성된 사용자 데이터를 반환해야 한다', async () => {
      const newUser = { name: 'John Doe', email: 'john@example.com' };
      const res = await request(app)
        .post('/api/v1/users')
        .send(newUser);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe(newUser.name);
      expect(res.body.email).toBe(newUser.email);
    });

    /**
     * 필수 필드 누락으로 인한 에러 응답 테스트
     *
     * 요청 데이터:
     *  - email: string (optional)
     *  (name 필드가 누락됨)
     *
     * 에러 응답:
     *   @responseField error string required 에러 메시지 (예: "Name is required")
     */
    it('name 필드가 없으면 400 에러를 반환해야 한다', async () => {
      const invalidUser = { email: 'no-name@example.com' };
      const res = await request(app)
        .post('/api/v1/users')
        .send(invalidUser);
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Name is required');
    });
  });

  // 추가: GET /api/v1/users 를 통해 새로 생성된 사용자가 잘 조회되는지 확인하는 테스트
  describe('GET /api/v1/users after POST', () => {
    /**
     * 사용자 생성 후, GET 요청시 생성된 사용자 목록에 새로 추가된 사용자가 포함되어 있는지 확인하는 테스트
     *
     * @responseField id number required    각 사용자 객체의 사용자 ID
     * @responseField name string required  각 사용자 객체의 사용자 이름
     * @responseField email string optional 각 사용자 객체의 사용자 이메일
     */
    it('사용자 생성 후, GET 요청시 생성된 사용자 목록을 포함해야 한다', async () => {
      // POST로 사용자 추가
      const newUser = { name: 'Jane Doe', email: 'jane@example.com' };
      await request(app).post('/api/v1/users').
      send(newUser);

      // GET 요청으로 사용자 목록 조회
      const res = await request(app).get('/api/v1/users');
      expect(res.statusCode).toBe(200);
      // 이전 테스트에서 추가된 사용자가 있을 수 있으므로, 목록에 newUser가 포함되어 있는지 확인
      const userExists = res.body.some(user => user.name === newUser.name && user.email === newUser.email);
      expect(userExists).toBe(true);
    });
  });
}); 


