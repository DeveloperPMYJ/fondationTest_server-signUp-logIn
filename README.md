# fondationtest
wecode 

foundation 2주 기간 마무리 후, 기본 초기세팅 (dbmate 연결 x, port 변수화 x, .env sample x, .gitignore x)

foundation 2주 후 구현

A. <초기 환경 세팅>

TypeORM을 이용 (javascript, express와 myspl 연결)

로컬 DB 구축 및 데이터베이스 서버 연동 (mysql의 데이터베이스- 백엔드 서버 연결) (Data Source has been initialized)

npm install mysql, mysql2, typeorm, dotenv,

DB 스키마 작성 및 migration 파일 구축

환경변수 .env 파일 작성 (환경변수 설정 TYPEORM_CONNECTION = mysql TYPEORM_HOST = 127.0.0.1 TYPEORM_USERNAME = root TYPEORM_PASSWORD = myPassword (mysql 로그인 비밀번호 적기) TYPEORM_DATABASE = mysql로 만든 데이터베이스 이름 적기 TYPEORM_PORT = 3306 TYPEORM_LOGGING =TRUE

.gitignore 파일 작성 (.env가 .gitignore에 포함됐기에, .env는 깃허브에 보이지 않음/ .env sample은 project1 단계에서 배움)

B. <회원가입 signUp API 구현>

회원가입 이메일 DB 확인 (중복 확인)
회원가입 시 필요한 예외처리
비밀번호 암호화 및 데이터베이스 저장
C. <로그인 signIn API 구현>

user 이메일 확인 (데이터베이스 이메일과 중복 확인 - 가입된 유저)
암호화된 비밀번호 vs 데이터베이스 비밀번호 비교 (가입된 유저인지 확인)
로그인 시 필요한 예외처리
로그인 성공 시 JWT 토근 발급
