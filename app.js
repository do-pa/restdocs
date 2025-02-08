// app.js
const express = require('express');
const app = express();

app.use(express.json());

// 메모리 내에서 사용자 정보를 저장합니다.
const users = [];

/**
 * GET /api/v1/users
 *
 * 응답:
 *   - Status: 200
 *   - Response Body: 사용자 객체의 배열
 *
 * 각 사용자 객체의 구조:
 *   @responseField id number required    사용자 ID
 *   @responseField name string required  사용자 이름
 *   @responseField email string optional 사용자 이메일
 */
app.get('/api/v1/users', (req, res) => {
  res.status(200).json(users);
});

/**
 * POST /api/v1/users
 *
 * 요청:
 *   - Request Body:
 *       - name: string (required)
 *       - email: string (optional)
 *
 * 성공 응답:
 *   - Status: 201
 *   - Response Body: 생성된 사용자 객체
 *
 * 사용자 객체의 구조:
 *   @responseField id number required    사용자 ID
 *   @responseField name string required  사용자 이름
 *   @responseField email string optional 사용자 이메일
 *
 * 에러 응답 (예: name 필드 누락 시):
 *   - Status: 400
 *   - Response Body: 에러 객체
 *
 * 에러 객체의 구조:
 *   @responseField error string required 에러 메시지 (예: "Name is required")
 */
app.post('/api/v1/users', (req, res) => {
  const { name, email } = req.body;
  
  // 간단한 유효성 검사: name 필수
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

module.exports = app;
