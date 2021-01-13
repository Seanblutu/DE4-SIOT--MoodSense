import React, {useEffect,useState} from 'react';
import { Dimensions, ActivityIndicator, StyleSheet, Text, SafeAreaView, ScrollView, RefreshControl,View,ImageBackground } from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Svg, {Circle} from 'react-native-svg'
import Swiper from 'react-native-swiper'
import {LineChart} from 'react-native-chart-kit'
import Constants from 'expo-constants';




const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
var colour = '#0EA31D'; 

var Ngrok = "d1aaca84aeb4" ;


var result = (time) => fetch('https://'+Ngrok+'.ngrok.io/index?time='+time, {
    method: 'get',
  }).then(function(response) {
    return response.json(); // pass the index as promise to next then block
  }).then(function(data) {
    var moodId = data.index;
  
    return fetch('https://'+Ngrok+'.ngrok.io/mood?index=' + moodId); // make a 2nd request and return mood
  })
  .then(function(response) {
    return response.json();
  })
  .catch(function(error) {
    console.log('Request failed', error)
  })

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(100);
  const [colour, setColour] = useState("green");
  const [graphD, setGraphData] = useState([1,1,-1,0,1]);
  const [graphL, setGraphLabel] = useState(["10:00","10:05","10:10","10:15","10:20"]);

  const map = (value) => (value +1) * (100) / (2) ;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    var d = new Date().toLocaleTimeString(); 
    var a = d.slice(0,6);

    result(a).then(function(r) {
      setGraphLabel(r.dates)
      setGraphData(r.data)
      setData(map(r.mood));

      if (parseInt(map(r.index)) <= 25 ){
        setColour("red")
        console.log("red",r.mood)
      }
  
      else if (25 < parseInt(map(r.index)) && parseInt(map(r.index)) < 75){
        setColour("orange")
        console.log("orange",r.mood)
      }
  
      else{
        setColour("green")
        console.log("green",map(r.mood))
      }
    });
  

    wait(1000).then(() => setRefreshing(false));
  }, [refreshing]);
  
    
  return (
    <Swiper showsButtons={false}>
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('./wireframe/home.png')} style={styles.image}>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <AnimatedCircularProgress
              size={200}
              width={50}
              fill={data}
              tintColor={colour}
              duration = {2000}
              rotation = {0}
              lineCap = "butt"

              backgroundColor="transparent"
              renderCap={({ center }) => <Circle cx={100} cy={100} r="60" fill='rgba(201,255,226,0.55)' />}
            >
              {
                (fill) => (
                  <Text style={styles.text}>
                    { fill.toFixed(0)}
                  </Text>
                )
              }

            </AnimatedCircularProgress>
          </ScrollView>
        </ImageBackground>
      </SafeAreaView>
      <SafeAreaView style={styles.container}>
        <ImageBackground source={require('./wireframe/home.png')} style={styles.image}>
          <ScrollView  contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            >
            <Text style={styles.text}>Mood Predictions</Text>
            <LineChart
              data={{
                labels: graphL,
                datasets: [
                  {
                    data: graphD
                  }
                ],
                
              }}
              width={Dimensions.get("window").width - 50} // from react-native
              height={220}
              fromZero = {true} 
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "rgba(211,211,211)",
                backgroundGradientTo: "rgba(220,220,220)",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(128,128,128, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(128,128,128, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "grey"
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
            </ScrollView>
          </ImageBackground>
      </SafeAreaView>

    </Swiper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },

  wrapper: {},

  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },

  text: {
    justifyContent: 'center',
    fontSize :28,
    fontWeight:"900",
    color: 'white'
  },
  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
});

