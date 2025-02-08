# 테스트 문서 자동 생성

## 파일: integration.test.js

### API 통합 테스트

- **초기에는 빈 배열을 반환해야 한다**

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| id | number | required | 각 사용자 객체의 사용자 ID |
| name | string | required | 각 사용자 객체의 사용자 이름 |
| email | string | optional | 각 사용자 객체의 사용자 이메일 |

- **정상적인 사용자 생성 요청시 201 상태 코드와 생성된 사용자 데이터를 반환해야 한다**

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| id | number | required | 생성된 사용자 객체의 ID |
| name | string | required | 생성된 사용자 객체의 이름 |
| email | string | optional | 생성된 사용자 객체의 이메일 |

- **name 필드가 없으면 400 에러를 반환해야 한다**

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| error | string | required | 에러 메시지 (예: "Name is required") |

- **사용자 생성 후, GET 요청시 생성된 사용자 목록을 포함해야 한다**

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| id | number | required | 각 사용자 객체의 사용자 ID |
| name | string | required | 각 사용자 객체의 사용자 이름 |
| email | string | optional | 각 사용자 객체의 사용자 이메일 |

### GET /api/v1/users

- **초기에는 빈 배열을 반환해야 한다**

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| id | number | required | 각 사용자 객체의 사용자 ID |
| name | string | required | 각 사용자 객체의 사용자 이름 |
| email | string | optional | 각 사용자 객체의 사용자 이메일 |

### POST /api/v1/users

- **정상적인 사용자 생성 요청시 201 상태 코드와 생성된 사용자 데이터를 반환해야 한다**

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| id | number | required | 생성된 사용자 객체의 ID |
| name | string | required | 생성된 사용자 객체의 이름 |
| email | string | optional | 생성된 사용자 객체의 이메일 |

- **name 필드가 없으면 400 에러를 반환해야 한다**

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| error | string | required | 에러 메시지 (예: "Name is required") |

### GET /api/v1/users after POST

- **사용자 생성 후, GET 요청시 생성된 사용자 목록을 포함해야 한다**

| Field | Type | Required | Description |
| ----- | ---- | -------- | ----------- |
| id | number | required | 각 사용자 객체의 사용자 ID |
| name | string | required | 각 사용자 객체의 사용자 이름 |
| email | string | optional | 각 사용자 객체의 사용자 이메일 |

