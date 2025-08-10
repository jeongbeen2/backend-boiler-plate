import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 기존 데이터 정리 (선택적)
  await prisma.user.deleteMany({})

  // 10명의 사용자 시드 데이터
  const users = [
    {
      email: 'john.doe@example.com',
      name: '김철수',
    },
    {
      email: 'jane.smith@example.com',
      name: '이영희',
    },
    {
      email: 'mike.johnson@example.com',
      name: '박민수',
    },
    {
      email: 'sarah.wilson@example.com',
      name: '최지연',
    },
    {
      email: 'david.brown@example.com',
      name: '정다윗',
    },
    {
      email: 'lisa.kim@example.com',
      name: '김리사',
    },
    {
      email: 'tom.lee@example.com',
      name: '이준호',
    },
    {
      email: 'anna.park@example.com',
      name: '박안나',
    },
    {
      email: 'james.choi@example.com',
      name: '최재민',
    },
    {
      email: 'emma.jung@example.com',
      name: '정엠마',
    },
  ]

  console.log('사용자 시드 데이터 생성 시작...')

  for (const userData of users) {
    const user = await prisma.user.create({
      data: userData,
    })
    console.log(`사용자 생성됨: ${user.name} (${user.email})`)
  }

  console.log('시드 데이터 생성 완료!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
