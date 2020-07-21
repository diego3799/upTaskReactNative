import React, {useState} from 'react';
import {View} from 'react-native';
import {
  Button,
  Container,
  Text,
  H1,
  Input,
  Form,
  Item,
  Toast,
} from 'native-base';
import globalStyles from '../styles/global';
import {useNavigation} from '@react-navigation/native';

import {gql, useMutation} from '@apollo/client';

import AsyncStorage from '@react-native-community/async-storage';

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;
const Login = () => {
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [mensaje, setMensaje] = useState(null);

  const handleSubmit = async () => {
    if (form.password === '' || form.email === '') {
      return setMensaje('Todos los campos son obligatorios');
    }

    try {
      const {
        data: {
          autenticarUsuario: {token},
        },
      } = await autenticarUsuario({
        variables: {
          input: {
            email: form.email,
            password: form.password,
          },
        },
      });
      await AsyncStorage.setItem('token', token);
      navigation.navigate('Proyectos');
    } catch (error) {
      return setMensaje(error.message);
    }
  };
  const monstrarLaerta = () => {
    Toast.show({
      text: mensaje,
      buttonText: 'OK',
      duration: 5000,
      useNativeDriver: false,
      onClose: function () {
        setMensaje(null);
      },
    });
  };
  return (
    <>
      <Container
        style={[{backgroundColor: '#e84347'}, globalStyles.contenedor]}>
        <View style={globalStyles.contenido}>
          <H1 style={globalStyles.titulo}>UpTask</H1>
          <Form>
            <Item inlineLabel last style={globalStyles.input}>
              <Input
                onChangeText={(e) => setForm({...form, email: e})}
                value={form.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCompleteType="email"
                placeholder="Email"
              />
            </Item>
            <Item inlineLabel last style={globalStyles.input}>
              <Input
                onChangeText={(e) => setForm({...form, password: e})}
                value={form.password}
                placeholder="Password"
                secureTextEntry
              />
            </Item>
          </Form>
          <Button
            onPress={handleSubmit}
            style={globalStyles.boton}
            square
            block>
            <Text style={globalStyles.botonTexto}>Iniciar Sesión</Text>
          </Button>
          <Text
            onPress={() => navigation.navigate('CrearCuenta')}
            style={globalStyles.enlace}>
            Crear Cuenta
          </Text>
        </View>
        {mensaje && monstrarLaerta()}
      </Container>
    </>
  );
};

export default Login;
