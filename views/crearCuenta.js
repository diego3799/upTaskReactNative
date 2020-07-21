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

const NUEVA_CUENTA = gql`
  mutation crearUsuario($input: UsuarioInput) {
    crearUsuario(input: $input)
  }
`;

const CrearCuenta = () => {
  const [crearUsuario] = useMutation(NUEVA_CUENTA);
  const navigation = useNavigation();
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
  });
  const [mensaje, setMensaje] = useState(null);
  const handleSubmit = async () => {
    if (form.nombre === '' || form.password === '' || form.email === '') {
      return setMensaje('Todos los campos son obligatorios');
    }
    if (form.password.length < 6) {
      return setMensaje('Password debe de ser mayor a 6 caracteres');
    }

    try {
      const {data} = await crearUsuario({
        variables: {
          input: {
            nombre: form.nombre,
            email: form.email,
            password: form.password,
          },
        },
      });
      //   console.log(data);
      navigation.navigate("Login")
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
                onChangeText={(e) => setForm({...form, nombre: e})}
                placeholder="Nombre"
                value={form.nombre}
              />
            </Item>
            <Item inlineLabel last style={globalStyles.input}>
              <Input
                onChangeText={(e) => setForm({...form, email: e})}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCompleteType="email"
                placeholder="Email"
                value={form.email}
              />
            </Item>
            <Item inlineLabel last style={globalStyles.input}>
              <Input
                onChangeText={(e) => setForm({...form, password: e})}
                placeholder="Password"
                secureTextEntry
                value={form.password}
              />
            </Item>
          </Form>
          <Button
            onPress={handleSubmit}
            style={globalStyles.boton}
            square
            block>
            <Text style={globalStyles.botonTexto}>Crear Cuenta</Text>
          </Button>
          {mensaje && monstrarLaerta()}
        </View>
      </Container>
    </>
  );
};

export default CrearCuenta;
