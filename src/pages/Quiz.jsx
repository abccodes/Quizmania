import React, { useState, useEffect } from "react";
import "../App.css";
import {
  Text,
  Box,
  Center,
  AbsoluteCenter,
  Button,
  Input,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});
const shape = [
  {
    question: "Who is Luke Skywalker's father?",
    answer: "Darth Vader",
    wrongAnswers: ["Obi-Wan Kenobi", "Yoda", "Emperor Palpatine"],
  },
];
const openai = new OpenAIApi(configuration);

async function run(topic) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `
                generate 10 trivia questions about ${topic} with answers. include three wrong answers.
                format the response as JSON in the shape of: ${JSON.stringify(
                  shape,
                )}
                `,
      },
    ],
  });

  const question = JSON.parse(completion.data.choices[0].message.content);

    question.forEach((item, index) => {
      console.log(`Question ${index + 1}: ${item.question}`);
      console.log(`Answer: ${item.answer}`);
      console.log(`Incorrect Answers: ${item.wrongAnswers.join(", ")}`);
      console.log("---------------------");

  });

  return question;
}

function Quiz() {
  let [question, setQuestion] = useState([]);
  let [topic, setTopic] = useState([]);
  let [isLoading, setIsLoading] = useState(false);
  let [index, setIndex] = useState([]);
  let [currentQuestionNumber, setCurrentQuestionNumber] = useState([]);
  let [score, setScore] = useState([]);
  let element;

  const handleTopicChange = (event) => setTopic(event.target.value);

  const buttonHandler = () => {
    setIsLoading((current) => !current);
  };

  async function generateQuizQuestions() {
    setCurrentQuestionNumber(0);
    buttonHandler();
    const data = await run(topic);
    setQuestion(data);
    setIndex(2);
  }

  function restartQuiz() {
    setCurrentQuestionNumber(0);
    setIndex(2);
  }

  function backToInput() {
    setIndex(3);
  }


  function GenerateAndCheckQuestion() {
    let first = true;
    let currQuestion = question[currentQuestionNumber];
    let correctAnswer = currQuestion.answer;
    let quesArr = [
      correctAnswer,
      currQuestion.wrongAnswers[0],
      currQuestion.wrongAnswers[1],
      currQuestion.wrongAnswers[2],
    ];

    if (currentQuestionNumber == 0 && first == true) {
      setTopic();
      buttonHandler();
      setScore(0);
      shuffleQuestion();
      first = false;
    }

    function shuffleQuestion() {
      for (let i = quesArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quesArr[i], quesArr[j]] = [quesArr[j], quesArr[i]];
      }
    }

    const checkAnswer = (num) => {
      let qNum = currentQuestionNumber;
      let s = score;

      if (qNum + 1 == 10 && quesArr[num] == correctAnswer) {
        setScore(s + 1);
        setIndex(1);
      } else if (qNum + 1 == 10 && quesArr[num] != correctAnswer) {
        setIndex(1);
      }

      if (quesArr[num] == correctAnswer) {
        setCurrentQuestionNumber(qNum + 1);
        setScore(s + 1);
        shuffleQuestion();
      } else {
        setCurrentQuestionNumber(qNum + 1);
        shuffleQuestion();
      }
    };

    return (
      <Box>
        <Center>
          <Text fontSize="xl" color="white">
            SCORE: {score}
          </Text>
        </Center>

        <Box mt="2" mb="5%">
          <Center>
            <Text fontSize="3xl" color="white">
              {currentQuestionNumber + 1}. {currQuestion.question}
            </Text>
          </Center>
        </Box>
        <Box display="grid" gridGap={2} gridAutoFlow="row dense">
          <Button fontSize="xl" onClick={() => checkAnswer(0)}>
            {quesArr[0]}
          </Button>
          <Button fontSize="xl" onClick={() => checkAnswer(1)}>
            {quesArr[1]}
          </Button>
          <Button fontSize="xl" onClick={() => checkAnswer(2)}>
            {quesArr[2]}
          </Button>
          <Button fontSize="xl" onClick={() => checkAnswer(3)}>
            {quesArr[3]}
          </Button>
        </Box>
        {/* <Box> */}
        {/* <Center> */}

        {/* </Center> */}
        {/* </Box> */}
      </Box>
    );
  }

  if (index == 1) {
    //end game screen
    element = (
      <Box w="100%" h="calc(100vh)" className="gradientBackground">
        <AbsoluteCenter>
          <Box>
            <Center>
              <Text fontSize="3xl" color="white" as="b">
                Game Over
              </Text>
            </Center>
          </Box>
          <Box>
            <Center>
              <Text fontSize="2xl" color="white" as="b">
                Final Score: {score}
              </Text>
            </Center>
          </Box>
          <Center>
            <Box display="grid" gridGap={2} gridAutoFlow="row dense" p="2%">
              <Button
                colorScheme="teal"
                size="lg"
                onClick={() => restartQuiz()}
              >
                Restart
              </Button>
              <Button colorScheme="teal" size="lg" onClick={() => backToInput()}>
                Back To Home
              </Button>
            </Box>
          </Center>
        </AbsoluteCenter>
      </Box>
    );
  } else if (index == 2) {
    //quiz screen
    element = (
      <Box w="100%" h="calc(100vh)" className="gradientBackground">
        <Text>
          <AbsoluteCenter>
            <GenerateAndCheckQuestion />
          </AbsoluteCenter>
        </Text>
      </Box>
    );
  } else {
    //input topic screen
    element = (
      <Box w="100%" h="calc(100vh)" className="gradientBackground">
        <AbsoluteCenter>
          <Box>
            <Center>
              <Text fontSize="5xl" color="white" as="b">
                Input a Topic
              </Text>
            </Center>
            <Input
              mt="5%"
              mb="5%"
              value={topic}
              onChange={handleTopicChange}
              placeholder=""
              size="lg"
              color="white"
            />
              <Box display="grid" gridGap={2} gridAutoFlow="row dense" p="2%">
                {isLoading ? (
                  <Button
                    colorScheme="teal"
                    isLoading
                    size="lg"
                    onClick={generateQuizQuestions}
                  >
                    Generating Quiz
                  </Button>
                ) : (
                  <Button
                    colorScheme="teal"
                    size="lg"
                    onClick={generateQuizQuestions}
                  >
                    Generate Quiz
                  </Button>
                )}
                 <Link to="/">
                <Button
                  w="100%"
                  colorScheme="teal"
                  size="lg"
                  onClick={backToInput}
                >
                  Back
                </Button>
                </Link>
              </Box>
          </Box>
        </AbsoluteCenter>
      </Box>
    );
  }

  return (
    <>
      <div>{element}</div>
    </>
  );
}

export default Quiz;

/* to do

error handling for openai req
easy, medium, hard feature
front end ui design


*/
