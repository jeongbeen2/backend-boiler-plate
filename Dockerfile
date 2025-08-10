FROM node:20-alpine
WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci --only=production

# 소스 코드 복사 및 빌드
COPY . .
RUN npx prisma generate
RUN npm run build

# 엔트리포인트 스크립트 권한 설정
RUN chmod +x scripts/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./scripts/entrypoint.sh"]
CMD ["node", "dist/index.js"]
