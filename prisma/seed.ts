import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // メインのテストユーザーの作成
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: `test.user.${Date.now()}@example.com`, // タイムスタンプを追加してユニークにする
    },
  })

  // アンケート1: テキストのみの選択肢
  const survey1 = await prisma.survey.create({
    data: {
      userId: user.id,
      title: '好きなプログラミング言語',
      choice_type: 'TEXT_ONLY',
      choices: {
        create: [
          { text: 'JavaScript', order: 1 },
          { text: 'Python', order: 2 },
          { text: 'Java', order: 3 },
          { text: 'C#', order: 4 },
          { text: 'Go', order: 5 },
        ],
      },
      attributes: {
        create: [
          {
            type: 'AGE',
            title: '年齢',
            choices: {
              create: [
                { text: '20代以下', order: 1 },
                { text: '30代', order: 2 },
                { text: '40代', order: 3 },
                { text: '50代以上', order: 4 },
              ],
            },
          },
          {
            type: 'CUSTOM',
            title: '経験年数',
            choices: {
              create: [
                { text: '1年未満', order: 1 },
                { text: '1-3年', order: 2 },
                { text: '3-5年', order: 3 },
                { text: '5年以上', order: 4 },
              ],
            },
          },
        ],
      },
    },
    include: {
      choices: true,
      attributes: {
        include: {
          choices: true,
        },
      },
    },
  })

  // アンケート2: テキスト＋画像の選択肢
  const survey2 = await prisma.survey.create({
    data: {
      userId: user.id,
      title: '好きなプログラミングエディタ',
      choice_type: 'TEXT_WITH_IMAGE',
      choices: {
        create: [
          { 
            text: 'Visual Studio Code',
            image_url: 'https://placeholder.com/vscode.png',
            order: 1 
          },
          { 
            text: 'IntelliJ IDEA',
            image_url: 'https://placeholder.com/intellij.png',
            order: 2 
          },
          { 
            text: 'Sublime Text',
            image_url: 'https://placeholder.com/sublime.png',
            order: 3 
          },
        ],
      },
    },
    include: {
      choices: true,
    },
  })

  // テスト回答の作成（Survey1用）
  // 20人分のランダムな回答を生成
  for (let i = 0; i < 20; i++) {
    const timestamp = Date.now() + i // 各ユーザーに異なるタイムスタンプを付与
    const responseUser = await prisma.user.create({
      data: {
        name: `Respondent ${i + 1}`,
        email: `respondent.${timestamp}@example.com`,
      },
    })

    // ランダムな選択肢を選ぶ
    const randomChoice = survey1.choices[Math.floor(Math.random() * survey1.choices.length)]
    
    // 回答を作成
    const response = await prisma.response.create({
      data: {
        surveyId: survey1.id,
        userId: responseUser.id,
        choiceId: randomChoice.id,
      },
    })

    // 属性回答を作成
    for (const attribute of survey1.attributes) {
      const randomAttributeChoice = attribute.choices[Math.floor(Math.random() * attribute.choices.length)]
      await prisma.respondentAttribute.create({
        data: {
          responseId: response.id,
          attributeSettingId: attribute.id,
          attributeChoiceId: randomAttributeChoice.id,
        },
      })
    }
  }

  // テスト回答の作成（Survey2用）
  // 10人分のランダムな回答を生成
  for (let i = 0; i < 10; i++) {
    const timestamp = Date.now() + i + 1000 // Survey1の回答者と重複しないようにオフセットを追加
    const responseUser = await prisma.user.create({
      data: {
        name: `Respondent ${i + 21}`,
        email: `respondent.${timestamp}@example.com`,
      },
    })

    // ランダムな選択肢を選ぶ
    const randomChoice = survey2.choices[Math.floor(Math.random() * survey2.choices.length)]
    
    await prisma.response.create({
      data: {
        surveyId: survey2.id,
        userId: responseUser.id,
        choiceId: randomChoice.id,
      },
    })
  }

  console.log('シードデータの作成が完了しました')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })