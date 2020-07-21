import React from 'react';
import 'react-native-gesture-handler';
import {StyleSheet} from 'react-native';
import Login from './views/login';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import CrearCuenta from './views/crearCuenta';
import {Root} from 'native-base';
import Proyectos from './views/proyectos';
import NuevoProyecto from './views/nuevoProyecto';
import Proyecto from './views/proyecto';
const Stack = createStackNavigator();
const App = () => {
  return (
    <Root>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            options={{
              title: 'Iniciar Sesión',
              headerShown: false,
            }}
            component={Login}
            name="Login"
          />
          <Stack.Screen
            name="CrearCuenta"
            component={CrearCuenta}
            options={{
              title: 'Crear Cuenta',
              headerStyle: {
                backgroundColor: '#28303b',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="Proyectos"
            component={Proyectos}
            options={{
              title: 'Proyectos',
              headerStyle: {
                backgroundColor: '#28303b',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="NuevoProyecto"
            component={NuevoProyecto}
            options={{
              title: 'Nuevo Proyecto',
              headerStyle: {
                backgroundColor: '#28303b',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen
            name="Proyecto"
            component={Proyecto}
            options={({route}) => ({
              title: route.params.nombre,
              headerStyle: {
                backgroundColor: '#28303b',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Root>
  );
};

const styles = StyleSheet.create({});

export default App;
