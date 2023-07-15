require('dotenv').config({
  path: './.env.local',
})
const fs = require('fs').promises
const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const shape = [
  {
    question: "Who is Luke Skywalker's father?",
    answer: 'Darth Vader',
    wrongAnswers: ['Obi-Wan Kenobi', 'Yoda', 'Emperor Palpatine'],
  },
]

let topic = 'animals'

const openai = new OpenAIApi(configuration)

;(async function run() {
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      //   { role: 'system', content: 'You are a helpful assistant.' },
      {
        role: 'user',
        content: `
        generate 10 trivia questions for Star Wars with answers. include three wrong answers.
        format the response as JSON in the shape of: ${JSON.stringify(shape)}
        `,
      },
    ],
  })
  console.log(completion.data.choices[0].message)

  const questions = JSON.parse(completion.data.choices[0].message.content)

  console.log('questions: ', questions)
  
    await fs.writeFile('./src/data/questions.json', JSON.stringify(questions, null, 2))
})()

// generate me 10 trivia questions about animals with answers included. Generate three incorrect answers. Format the response in JSON in the shape of:
// [{
//     “question”:”Who is Luke Skywalker’s father?”,
//     “answer”:”Darth Vader”,
//     “wrongAnswers”:[“Obi-Wan Kenobi", “Emperor Palpatine”, “Yoda”]
//     }]
