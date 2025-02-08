## 계획
지금은 test코드 내의 어노테이션을 기반으로 문서가 나옴 -> 이를 test 코드내에 restdocs 함수를 호출하면 -> 테스트도 되고 문서도 된다. 

## 기능세부계획

### 문서화
두가지 타입으로 가능하게 설정
 - markdown
 - swagger spec

## 폴더구조
```
restdocs/
├── docs/   
├── snippet/  # 테스트 코드 -> 파싱   
├── ci/        
├── core/        
├── test/       
├── bin/        
├── interface/   
├── .gitignore               # Git에서 무시할 파일 목록
├── README.md                # 프로젝트 소개, 사용법, 설치 및 기여 방법 등
├── CONTRIBUTING.md          # 기여 가이드라인 (오픈소스 프로젝트의 경우 필수)
└── LICENSE                  # 라이선스 파일 (예: Apache, MIT 등)
``` 

### 커미션규칙 
이슈기반으로 -> commit closed 또는 related로 진행하기