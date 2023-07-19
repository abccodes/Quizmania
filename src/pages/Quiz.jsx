import React, { useState, useEffect } from "react";
import "../App.css";
import {
  Text,
  Box,
  Center,
  AbsoluteCenter,
  Button,
  Input,
  Heading,
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
    buttonHandler();
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
          <Text fontSize="xl" color="black">
            {score} / 10
          </Text>
        </Center>

        <Box mt="2" mb="5%">
          <Center>
            <Text fontSize="3xl" color="black">
              {currentQuestionNumber + 1}. {currQuestion.question}
            </Text>
          </Center>
        </Box>
        <Box display="grid" gridGap={2} gridAutoFlow="row dense">
          <Button
            colorScheme={"red"}
            bg={"red.400"}
            _hover={{ bg: "red.300" }}
            rounded={"full"}
            px={6}
            onClick={() => checkAnswer(0)}
          >
            {quesArr[0]}
          </Button>
          <Button
            colorScheme={"red"}
            bg={"red.400"}
            _hover={{ bg: "red.500" }}
            rounded={"full"}
            px={6}
            onClick={() => checkAnswer(1)}
          >
            {quesArr[1]}
          </Button>
          <Button
            colorScheme={"red"}
            bg={"red.400"}
            _hover={{ bg: "red.500" }}
            rounded={"full"}
            px={6}
            onClick={() => checkAnswer(2)}
          >
            {quesArr[2]}
          </Button>
          <Button
            colorScheme={"red"}
            bg={"red.400"}
            _hover={{ bg: "red.500" }}
            rounded={"full"}
            px={6}
            onClick={() => checkAnswer(3)}
          >
            {quesArr[3]}
          </Button>
        </Box>
      </Box>
    );
  }

  if (index == 1) {
    //end game screen
    element = (
      <Box w="100%" h="calc(100vh)" className="gradientBackground">
        <AbsoluteCenter>
          <Center>
            <Text fontSize={{ base: "3xl", sm: "3xl", md: "4xl" }} as={"span"}>
              {score} / 10
            </Text>
          </Center>
          <Box>
            <Center>
              <Heading
                m="5"
                fontWeight={600}
                fontSize={{ base: "5xl", sm: "5xl", md: "7xl" }}
                lineHeight={"110%"}
              >
                Game Over
              </Heading>
            </Center>

            <Box display="grid" gridGap={2} gridAutoFlow="row dense" p="2%">
              <Button
                rounded={"full"}
                px={6}
                colorScheme={"red"}
                bg={"red.400"}
                _hover={{ bg: "red.500" }}
                onClick={() => restartQuiz()}
              >
                Restart
              </Button>
              <Button
                rounded={"full"}
                px={6}
                colorScheme={"red"}
                bg={"red.400"}
                _hover={{ bg: "red.500" }}
                onClick={() => backToInput()}
              >
                Back To Home
              </Button>
            </Box>
          </Box>
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
            <Heading
              fontWeight={600}
              fontSize={{ base: "5xl", sm: "5xl", md: "6xl" }}
              lineHeight={"110%"}
            >
              Test your{" "}
              <Text as={"span"} color={"red.400"}>
                knowledge
              </Text>
            </Heading>
            <Input
              mt="5%"
              mb="5%"
              value={topic}
              onChange={handleTopicChange}
              placeholder=""
              size="lg"
              color="black"
            />
            <Box display="grid" gridGap={2} gridAutoFlow="row dense" p="2%">
              {isLoading ? (
                <Button
                  px={6}
                  colorScheme={"red"}
                  bg={"red.400"}
                  rounded={"full"}
                  isLoading
                  onClick={generateQuizQuestions}
                >
                  Generating Quiz
                </Button>
              ) : (
                <Button
                  onClick={generateQuizQuestions}
                  rounded={"full"}
                  px={6}
                  colorScheme={"red"}
                  bg={"red.400"}
                  _hover={{ bg: "red.500" }}
                >
                  Generate Quiz
                </Button>
              )}
              <Link to="/">
                <Button w="100%" rounded={"full"} px={6} onClick={backToInput}>
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
