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


function landingPage() {
  // const [topic, setTopic] = useState([])
  //   const handleTopicChange = (event) => setTopic(event.target.value)

  return (
    <div className="App">
      <Box w="100%" h="calc(100vh)" className="gradientBackground">
        <AbsoluteCenter>
          <Box >
            <Text fontSize="lg" color='white'>
              Are you ready to put your knowledge to the test?
            </Text>
            <Text fontSize="7xl" color='white' as='b'>Quiz Mania</Text>
            <Center>
              <Box>
                <Text fontSize="3xl" color='white'>How It Works:</Text>
                <Text fontSize="xl" color='white'>Choose Any Topic</Text>
                <Text fontSize="xl" color='white'>Test Your Knowledge</Text>
                <Text fontSize="xl" color='white'>Compete and Share</Text>
              </Box>
            </Center>
            <Link to="/quiz">
            <Button colorScheme="teal" size="lg">
              Get Started
            </Button>
            </Link>
            {/* <Button
              isLoading
              loadingText="Submitting"
              colorScheme="teal"
              variant="outline"
            >
              Submit
            </Button> */}
          </Box>
        </AbsoluteCenter>
      </Box>
      {/* <Text mb="8px">Value: {topic}</Text>
      <Input
        value={topic}
        onChange={handleTopicChange}
        placeholder="Here is a sample placeholder"
        size="lg"
      /> */}
    </div>
  )
}

export default landingPage
