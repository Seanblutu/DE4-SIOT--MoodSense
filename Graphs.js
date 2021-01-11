import React, {useEffect,useState} from 'react';
import { Dimensions, ActivityIndicator, StyleSheet, Text, SafeAreaView, ScrollView, RefreshControl,View, ImageBackground } from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from 'react-native-chart-kit';
import { Line } from 'react-native-svg';

    const wait = (timeout) => {
        return new Promise(resolve => {
        setTimeout(resolve, timeout);
        });
    }

var Ngrok = "d1aaca84aeb4" ;

var result = (time) => fetch('https://'+Ngrok+'.ngrok.io/index?time='+time, {
    method: 'get',
  }).then(function(response) {
    return response.json(); // pass the data as promise to next then block
  }).then(function(data) {
    var moodId = data.index;
  
    return fetch('https://'+Ngrok+'.ngrok.io/mood?index=' + moodId); // make a 2nd request and return a promise
  })
  .then(function(response) {
    return response.json();
  })
  .catch(function(error) {
    console.log('Request failed', error)
  })



export default function Graphs() {
    const [refreshing, setRefreshing] = React.useState(false);
    const [pie, setPieData] = useState([]);
    const [Linex, setLineXData] = useState([]);
    const [Liney, setLineYData] = useState([]);
    const screenWidth = Dimensions.get("window").width;
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        var d = new Date().toLocaleTimeString(); 
        var a = d.slice(0,6);

        result(a).then(function(r) {
            setPieData(r.PieData)
            console.log(r.LineData.x.slice(0,100))
            setLineXData(r.LineData.x.slice(0,100))
            setLineYData(r.LineData.y.slice(0,100));
            
        });
        wait(1000).then(() => setRefreshing(false));
    },[refreshing]);

    const Linedata = {
        labels: ["January", "February"],
        datasets: [
          {
            data: [20, 45]
          }
        ],
        legend: ["Rainy Days"] // optional
      };
    
    const Piedata = [
        {
          name: "Negative",
          population: pie[2],
          color: "#E5C2C0",
          legendFontColor: "white",
          legendFontSize: 15
        },
        {
          name: "Neutral",
          population: pie[1],
          color: "#3E92CC",
          legendFontColor: "white",
          legendFontSize: 15
        },
        {
          name: "Positive",
          population: pie[0],
          color: "#0EA31D",
          legendFontColor: "white",
          legendFontSize: 15
        }
      ];
    const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: () => `black`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
    };

    var d = new Date().toLocaleTimeString(); 
    var a = d.slice(0,6);

    return (
        <ImageBackground source={require('./wireframe/home.png')} style={styles.image}>
            <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            >
            <Text style={styles.Text}> Sentiment Distribution </Text>
        
            <PieChart
                data={Piedata}
                width={Dimensions.get("window").width - 50}
                height={200}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"rgba(201,255,226,0.3)"}
                backgroundGradientFromOpacity={0.5}
                paddingLeft={"-10"}
                center={[20, 0]}
                absolute = {false}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16
                }}
                />
                <Text style={styles.Text}>Historic Data</Text>
                <LineChart
                data={{
                    labels: ["00:00","06:00","12:00","18:00"],
                    datasets: [
                    {
                        data: Liney
                    }
                    ],
                    
                }}
                width={Dimensions.get("window").width - 50} // from react-native
                height={220}
                fromZero = {true} 
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    backgroundGradientFrom: "rgba(211,211,211)",
                    backgroundGradientFromOpacity: 0.3,
                    backgroundGradientTo: "rgba(220,220,220)",
                    backgroundGradientToOpacity: 0.5,
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 5) => `rgba(255,255,255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
                    style: {
                    borderRadius: 16
                    },
                    propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
                yAxisInterval = {100}
                withDots = {false}
                
                />
            </ScrollView>
        </ImageBackground>

    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      },
    Text: {
        paddingTop : 50,
        fontSize :20,
        fontWeight:"900",
        color: 'white'
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
      },
    });