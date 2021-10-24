import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const App = () => {
  const [started, setStarted] = useState(false);

  const [rightCount, setRightCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [answer, setAnswer] = useState('');

  const [index, setIndex] = useState(0);

  const [blur, setBlur] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const [wrongAnswer, setWrongAnswer] = useState(false);

  const [quiz, setQuiz] = useState([]);

  const [arithmeticIndex, setArithmeticIndex] = useState(-1);

  const questionCount = 10;

  const arithmetics = [
    {
      arithmetic: '+',
      levels: [
        [0, 9],
        [0, 100],
        [0, 1000],
      ],
      calc: (a, b) => a + b,
      left: level => random(level),
      right: level => random(level),
    },
    {
      arithmetic: '-',
      levels: [
        [0, 9],
        [0, 100],
        [0, 1000],
      ],
      calc: (a, b) => a - b,
      left: level => random(level),
      right: level => random(level),
    },
    {
      arithmetic: '*',
      levels: [
        [0, 9],
        [0, 20],
        [0, 30],
      ],
      calc: (a, b) => a * b,
      left: level => random(level),
      right: level => random(level),
    },
    {
      arithmetic: '/',
      levels: [
        [0, 9],
        [0, 50],
        [0, 100],
      ],
      calc: (a, b) => Math.floor(a / b),
      left: level => random(level),
      right: level => random(level.map(l => l + 1)),
    },
  ];

  function createQuiz(questionCount, arithmeticIndex) {
    const quiz = [];

    for (let index = 0; index < questionCount; index++) {
      const arithmeticObj = arithmetics[arithmeticIndex ?? random([0, 3])];
      const arithmetic = arithmeticObj.arithmetic;

      const level = Math.max(Math.floor(Math.log2(index)), 1) - 1;
      const leftNumber = arithmeticObj.left(arithmeticObj.levels[level]);
      const rightNumber = arithmeticObj.right(arithmeticObj.levels[level]);
      let result = arithmeticObj.calc(leftNumber, rightNumber);

      quiz.push({
        leftNumber,
        arithmetic,
        rightNumber,
        result,
      });
    }
    setQuiz(quiz);
  }

  function random(level) {
    return Math.floor(Math.random() * (level[1] - level[0] + 1)) + level[0];
  }

  useEffect(() => {
    if (arithmeticIndex == -1) {
      return;
    }
    createQuiz(questionCount, arithmeticIndex);
    setStarted(true);
  }, [arithmeticIndex]);

  return (
    <View style={styles.container}>
      {started ? (
        <>
          <TouchableOpacity
            style={[
              styles.button,
              {position: 'absolute', top: 0, left: 0, width: 100},
            ]}
            onPress={() => {
              setStarted(false);
              setVisible(true);
              setIndex(0);
              setBlur(false);
              setShowResult(false);
              setRightCount(0);
              setWrongCount(0);
              setWrongAnswer(false);
              setAnswer('');
            }}>
            <Text style={styles.buttonText}>Geri</Text>
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={styles.countContainer}>
              <Text style={styles.rightCount}>{rightCount}</Text>
              <Text style={styles.wrongCount}>{wrongCount}</Text>
            </View>

            <Text style={styles.questionText}>{index + 1 + '. Soru'}</Text>

            <View
              style={[
                styles.question,
                {backgroundColor: showResult ? 'rgba(252,52,25,0.3)' : 'white'},
              ]}>
              <Text style={styles.questionText}>{quiz[index]?.leftNumber}</Text>
              <Text style={styles.questionText}>{quiz[index]?.arithmetic}</Text>
              <Text style={styles.questionText}>
                {quiz[index]?.rightNumber}
              </Text>
              <Text
                style={[
                  styles.questionText,
                  {display: showResult ? 'flex' : 'none'},
                ]}>
                {'= ' + quiz[index]?.result}
              </Text>
            </View>
            <TextInput
              style={[styles.input, {display: visible ? 'flex' : 'none'}]}
              value={answer}
              keyboardType="numeric"
              onChangeText={val => {
                setAnswer(val);
              }}
              blurOnSubmit={blur}
              onSubmitEditing={event => {
                if (answer === '' || wrongAnswer) {
                  return;
                }

                if (index === Math.max(quiz.length - 2, 0)) {
                  setBlur(true);
                }

                if (quiz[index].result == answer) {
                  setRightCount(rightCount + 1);
                  if (index === quiz.length - 1) {
                    setVisible(false);
                  } else {
                    setIndex(index + 1);
                  }

                  setAnswer('');
                } else {
                  setWrongCount(wrongCount + 1);
                  setShowResult(true);
                  setWrongAnswer(true);
                  setTimeout(() => {
                    if (index === quiz.length - 1) {
                      setVisible(false);
                    } else {
                      setWrongAnswer(false);
                      setShowResult(false);
                      setIndex(index + 1);
                    }

                    setAnswer('');
                  }, 1500);
                }
              }}
            />
            {!visible && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setStarted(true);
                  setVisible(true);
                  setIndex(0);
                  setBlur(false);
                  createQuiz(questionCount, arithmeticIndex);
                  setWrongAnswer(false);
                  setShowResult(false);
                }}>
                <Text style={styles.buttonText}>Devam</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setArithmeticIndex(0);
            }}>
            <Text style={styles.buttonText}>Toplama</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setArithmeticIndex(1);
            }}>
            <Text style={styles.buttonText}>Çıkarma</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setArithmeticIndex(2);
            }}>
            <Text style={styles.buttonText}>Çarpma</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setArithmeticIndex(3);
            }}>
            <Text style={styles.buttonText}>Bölme</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setArithmeticIndex(null);
            }}>
            <Text style={styles.buttonText}>Karışık</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(255,242,232)',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  rightCount: {
    backgroundColor: 'green',
    padding: 10,
    margin: 10,
    fontSize: 18,
    borderRadius: 15,
    width: 100,
    textAlign: 'center',
    color: 'rgb(232,242,252)',
  },
  wrongCount: {
    backgroundColor: 'red',
    padding: 10,
    margin: 10,
    fontSize: 18,
    borderRadius: 15,
    width: 100,
    textAlign: 'center',
    color: 'rgb(232,242,252)',
  },
  question: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 15,
  },
  questionText: {
    fontSize: 25,
    margin: 10,
    padding: 5,
    color: 'black',
  },
  input: {
    padding: 10,
    margin: 10,
    width: 250,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    color: 'black',
  },
  button: {
    backgroundColor: 'rgb(151,252,151)',
    margin: 10,
    padding: 10,
    width: 150,
  },
  buttonText: {
    textAlign: 'center',
    color: 'rgb(0, 0, 0)',
    fontSize: 20,
  },
});

export default App;
