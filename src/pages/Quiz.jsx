import React, { useState, useEffect } from 'react'
import '../App.css'
import triviaQuestions from '../data/questions.json'
import {
  Text,
  Box,
  Center,
  Square,
  Circle,
  AbsoluteCenter,
  Button,
  Input,
  ButtonGroup,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
})

const shape = [
  {
    question: "Who is Luke Skywalker's father?",
    answer: 'Darth Vader',
    wrongAnswers: ['Obi-Wan Kenobi', 'Yoda', 'Emperor Palpatine'],
  },
]

const openai = new OpenAIApi(configuration)


async function run(topic) {

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: `
                generate 10 trivia questions about ${topic} with answers. include three wrong answers.
                format the response as JSON in the shape of: ${JSON.stringify(
                  shape,
                )}
                `,
      },
    ],
  })

  const question = JSON.parse(completion.data.choices[0].message.content)
  // console.log('UASBDUASDBASD ', question[0].question)
  // console.log('UASBDUASDBASD ', question[1].question)
  // console.log('UASBDUASDBASD ', question[2].question)
  // console.log('UASBDUASDBASD ', question[3].question)
  // console.log('UASBDUASDBASD ', question[4].question)
  console.log("STARTSTARTSTART");
  question.forEach((item, index) => {
    console.log(`Question ${index + 1}: ${item.question}`);
    console.log(`Answer: ${item.answer}`);
    console.log(`Incorrect Answers: ${item.wrongAnswers.join(", ")}`);
    console.log("---------------------");
});

  return question
}


function Quiz() {
  let [question, setQuestion] = useState([])
  let [topic, setTopic] = useState([])
  let [isLoading, setIsLoading] = useState(false)
  let [index, setIndex] = useState([])
  let element;

  const handleTopicChange = (event) => setTopic(event.target.value)
  const buttonHandler = () => {
    setIsLoading(current => !current)
  }

  async function getQuestion() {
    buttonHandler();
    const data = await run(topic);
    setQuestion(data)
    setIndex(2);
    console.log('index: ', index)
  }
  // console.log('index: ', index)
  // console.log('base ques: ', question)

    if(index == 1) { //end game screen
      <Box w="100%" h="calc(100vh)" className="gradientBackground">
        <Text>
          Restart Game
        </Text>
      </Box>
    } else if(index == 2) { //quiz screen
     element = <Box w="100%" h="calc(100vh)" className="gradientBackground">
            <AbsoluteCenter>
              <Box>
                <Center>
                <Text fontSize="7xl" color="white" as="b">
              Questions
            </Text>
                </Center>
              </Box>
            </AbsoluteCenter>
      </Box>
    } else { //input topic screen
      element =         
      <Box w="100%" h="calc(100vh)" className="gradientBackground">
      <AbsoluteCenter>
        <Box>
          <Center>
            <Text fontSize="7xl" color="white" as="b">
              Input a Topic
            </Text>
          </Center>
          <Input
            value={topic}
            onChange={handleTopicChange}
            placeholder="Here is a sample placeholder"
            size="lg"
            color="white"
          />
          <div>
            {   isLoading ? (
            <Button
            colorScheme="teal"
            isLoading
            size="lg"
            onClick={getQuestion}
          ></Button>
          ) : (              
            <Button
            colorScheme="teal"
            size="lg"
            onClick={getQuestion}
          >
            Generate Quiz
          </Button>
          )       }
          </div>

        </Box>
      </AbsoluteCenter>
    </Box>
    }

  return (
    <>
      <div>
        {element}
      </div>
    </>
  )
}

export default Quiz
