# SweepicBE

## 기술 스택

- **언어**: TypeScript
- **런타임**: Node.js
- **데이터베이스**: MySQL
- **ORM**: Prisma
- **빌드 도구**: Esbuild
- **환경 변수 관리**: dotenv

---

## 주요 라이브러리

### Production Dependencies

- **express** (`^5.0.0`): 서버 애플리케이션을 위한 간단하고 유연한 웹 프레임워크
- **cors** (`^2.8.5`): Cross-Origin Resource Sharing을 설정하여 보안 내에서 외부 클라이언트와 서버 간 통신을 허용
- **dotenv** (`^16.4.7`): 환경 변수를 파일에 저장하고 로드하는 데 사용
- **http-status-codes** (`^2.3.0`): HTTP 상태 코드를 쉽게 사용하고 관리하기 위한 라이브러리
- **mysql2** (`^3.12.0`): MySQL 데이터베이스 연결을 위한 고성능 Node.js 라이브러리
- **prisma** (`^6.1.0`): ORM 도구로 스키마 기반 데이터베이스 관리와 자동 생성 코드 지원
- **@prisma/client** (`^6.1.0`): Prisma ORM에서 사용하는 클라이언트 라이브러리로, 데이터베이스와의 간편한 상호작용 지원

### Development Dependencies

- **nodemon** (`^3.1.9`): 개발 중 애플리케이션 변경 사항을 감지하여 자동으로 서버를 재시작
- **tsx** (`^4.19.2`): TypeScript 실행 및 개발 서버를 간편하게 관리
- **typescript** (`^5.7.2`): TypeScript 컴파일러
- **@tsconfig/node20** (`^20.1.4`): Node.js 20 버전에서 TypeScript 설정을 위한 공유 설정
- **@types/cors** (`^2.8.17`): `cors` 라이브러리의 TypeScript 타입 정의 제공
- **@types/express** (`^5.0.0`): `express` 라이브러리의 TypeScript 타입 정의 제공
- **@types/express-session** (`^1.18.1`): Express의 세션 관리를 위한 타입 정의
- **@types/node** (`^22.10.3`): Node.js 전역 객체 및 API를 위한 TypeScript 타입 정의
- **@types/passport** (`^1.0.17`): Passport.js의 타입 정의
- **@types/swagger-ui-express** (`^4.1.7`): Swagger UI Express의 타입 정의
- **esbuild** (`^0.24.2`): 빠른 JavaScript 및 TypeScript 번들러
- **@types/passport-google-oauth20** (`^2.0.16`): Google OAuth 2.0 Passport 전략의 타입 정의

---

## 프로세스

- **0. Sweepic-Server 레포지토리 Fork**
- **1. Jira 확인 및 변경**: 담당 이슈 확인 후, 이슈 번호 및 세부 내용 파악 후 스프린트 배정 및 워크플로 *진행 중*으로 변경
- **2. Github 이슈 생성**: 이슈 생성 후 브랜치 생성
- **3. 해당 브랜치에 PR 및 Merge(개발 중)**: 개인 레포지토리에서 개발 후, 해당 브랜치에 Merge (PR rules & Template 미적용)
- **4. develop 브랜치 PR 생성 및 리뷰(개발 후)**: 해당 기능 개발 완료 후, develop 브랜치에 PR 생성 (PR rules & Template 적용)
- **5. develop Merge(리뷰 해결 후)**: 팀원의 리뷰들 해결 후, approve 후에 Merge
- **주의할 점: 개발 중 develop 브랜치와 다를 수 있기에 개발 시작 전, git pull 을 항상 할 것**

---

## Git Branch 전략

### Issue 생성

![issue1](https://github.com/user-attachments/assets/54d9408c-2198-4490-a8b6-9bbe96da4a92)

- 이슈 템플릿 지정

![issue2](https://github.com/user-attachments/assets/283a0bb0-acad-4efb-ab88-c2da1cdba39a)

- 이슈 템플릿 작성, 할당자, 라벨 등록
  - 이슈 템플릿에서 개발 예상 계획을 수립
  - 이슈 이름: [SWEP-?] 해당 기능 설명

![issue3](https://github.com/user-attachments/assets/57b67393-fdf5-44ee-8d26-32a54a225d0d)

- 브랜치 생성
  - 저 동그라미(Create a branch)를 통해 브랜치를 만들어주세요!
  - 브랜치 이름: **업무종류/이슈번호**
  - ex. feature/SWEP-? : eature, fix, docs 등등 상황에 맞게 지정
  - Checkout locally 선택

![issue4](https://github.com/user-attachments/assets/63141e51-0875-4edc-869e-1847c5bd5b13)

- 브랜치 작업 명령어 복사 후, 터미널에서 작업
- **주의할 점**
  - **새 브랜치가 뻗어나갈 브랜치에서 브랜치를 만들어줘야 한다는 것**
  - **develop 브랜치가 개발 중심 브랜치**
  - 항상 develop 브랜치와 기능 개발 브랜치(feature/SWEP-12)와 같아야 함.

![issue5](https://github.com/user-attachments/assets/3e4157a5-9035-4809-8121-8657df2cb012)

### Branch Rule

![git_flow](https://github.com/user-attachments/assets/0379b23a-5323-4303-9bcb-eed4eb18eec9)

- feature/SWEP-?: 각자 기능 개발할 때 사용, 로컬에서 각자 테스트
  - Squash and Merge
- develop: 개발한 기능을 병합, 로컬에서 테스트 진행
- hotfixes: 배포 후 발견하지 못한 버그 발생 시, 긴급 버그 수정 및 배포 (임시 생성)
- main:실제 운영할 서버 및 개발시 테스트용 서버로 배포, develop에서 QA 후 main으로 merge도 가능.

1. **main** 브랜치에서 시작
2. 동일한 브랜치를 **develop**에도 생성 후 개발자들이 **develop** 브랜치에서 개발을 진행
3. 기능 개발이 필요한 경우 **develop 브랜치에서 feature 브랜치 생성** 후 기능 구현
   - (참고) 원격 저장소의 branch 가져오기: `git checkout -t origin/develop`
   - 방법: `git checkout -b <생성할 브랜치 이름> <분기할 브랜치 이름>`
     - 예) `git checkout -b feature/login develop`
   - branch 이름 규칙
     - `해당 작업 유형/이슈번호` ex) feature/SWEP-12
     - feature : 새로운 기능 개발
     - fix : 버그 수정
     - refactor : 리팩토링
     - docs : 문서수정
     - chore : 빌드 업무 수정, 패키지 매니저 수정 등
     - test : 테스트 코드
4. 완료된 feature/SWEP-? 브랜치는 PR을 거쳐 **develop 브랜치에 merge**
5. 모든 기능 개발이 완료되면 develop 브랜치로부터 release 브랜치로 merge
6. 배포 진행
7. 배포 후 미처 발견하지 못한 버그 발생 시 hotfixes 브랜치를 만들어 긴급 수정 후 main 브랜치에 merge 및 배포 (PR rules 미작용으로 신중하게 사용 권장)

### Commit Rule

- **커밋 메시지만 봐도 내용을 알 수 있게 적어야 한다.**
- 작업은 다음의 규칙에 따라 구분한다.
- `[이슈 번호] 작업 내용` ex) [SWEP-12] 아이디 포함 각 항목 정규식 구현
- 한 기능에 여러 개의 이슈 번호를 포함한 커밋 메세지 가능
  - ex. PR 제목: [SWEP-16] 소셜로그인 구현
    - [SWEP-16] 사용자 추가 정보 입력 API
    - [SWEP-16] 네이버 소셜로그인 구현
    - [SWEP-16] 카카오 소셜로그인 구현현

### PR rule

- **PR 템플릿**
  <https://github.com/Sweepic/sweepic-Server/blob/develop/.github/PULL_REQUEST_TEMPLATE.md>

![PR1](https://github.com/user-attachments/assets/816ea931-fd49-40f5-98ed-4b4cd62431d9)

- _feature/SWEP-? -> develop_ 에서 적용
- PR 제목: **[SWEP-?] 작업 내용**

- **1. close 키워드** : PR 생성 시 내용에 관련 *github 이슈 번호*를 꼭 입력. 사용 시 merge 시 자동으로 issue가 닫힘. (close #?)
- **2. Reviewers 설정**: 다른 Server 다섯 팀원 모두
- **3. Assignees 설정**: 본인
- **4. Labels 설정**
- **5. 코드 리뷰 진행**
- **6. merge 시 Squash and Merge로 진행**

- **feature → develop Merge 시 Squash and Merge**가 유용하다**.**
  feature 브랜치에서 기능을 개발하기 위한 지저분한 커밋 내역을 하나의 커밋으로 묶어 develop 브랜치에 병합하면서, develop에는 기능 단위로 커밋이 추가되도록 정리할 수 있다.
  또한 feature 브랜치는 develop 브랜치에 병합 후 제거되므로, Merge Commit을 남길 필요가 없다.
- **develop → main Merge 시에는 Rebase And Merge**가 적합하다.
  main 브랜치는 지금까지 작업한 모든 기능을 배포할 때 병합한다. develop 브랜치를 Squash and Merge하게 되면 커밋 이력이 모두 사라져, 특정 기능에서 문제가 생겼을 때 롤백할 수 없게 된다. main 브랜치 또한 Merge Commit을 남길 필요가 없다. 따라서 **Rebase And Merge**가 적합하다.

---

## 코딩 컨벤션
