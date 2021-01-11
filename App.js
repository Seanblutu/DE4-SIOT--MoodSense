import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import HomeScreen from'./Homescreen'
import Graphs from './Graphs'



const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Mood') {
              iconName = focused
                ? 'happy'
                : 'happy-outline';
            } else if (route.name === 'Data') {
              iconName = focused ? 'analytics' : 'analytics-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: '#0EA31D',
          inactiveTintColor: 'grey',
          activeBackgroundColor:'white',
          inactiveBackgroundColor:'white',
          labelStyle:{fontWeight:'700',
                      paddingBottom:6},
          
        
        }}

      >
        <Tab.Screen name="Mood" component={HomeScreen} />
        <Tab.Screen name="Data" component={Graphs} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}