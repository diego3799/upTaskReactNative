import React, {useState} from 'react';
import {View} from 'react-native';
import {
  Text,
  Container,
  Button,
  H1,
  Form,
  Item,
  Input,
  Toast,
} from 'native-base';
import globalStyles from '../styles/global';
import {useNavigation} from '@react-navigation/native';

import {gql, useMutation} from '@apollo/client';
const CREAR_PROYECTO = gql`
  mutation nuevoProyecto($input: ProyectoInput) {
    nuevoProyecto(input: $input) {
      nombre
      id
    }
  }
`;
/**Actualizar cache */
const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id
      nombre
    }
  }
`;
const NuevoProyecto = () => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [nuevoProyecto] = useMutation(CREAR_PROYECTO, {
    update(cache, {data: {nuevoProyecto}}) {
      const {obtenerProyectos}=cache.readQuery({query:OBTENER_PROYECTOS})
      cache.writeQuery({
        query:OBTENER_PROYECTOS,
        data:{
          obtenerProyectos:obtenerProyectos.concat([nuevoProyecto])
        }
      })
    },
  });
  const navigation = useNavigation();
  const handleSubmit = async () => {
    if (nombre === '') {
      return setMensaje('El nombre del Proyecto es Obligatorio');
    }
    try {
      const {data} = await nuevoProyecto({
        variables: {
          input: {
            nombre,
          },
        },
      });
      setMensaje('Proyecto creado correctamente');
      navigation.navigate('Proyectos');
    } catch (error) {
      console.log(error);
      setMensaje(error.message);
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
    <Container style={[globalStyles.contenedor, {backgroundColor: '#e84347'}]}>
      <View style={globalStyles.contenido}>
        <H1 style={globalStyles.subtitulo}>Nuevo Proyecto</H1>
        <Form>
          <Item last style={globalStyles.input}>
            <Input
              value={nombre}
              onChangeText={(text) => setNombre(text)}
              placeholder="Nombre del proyecto"
            />
          </Item>
        </Form>
        <Button
          onPress={handleSubmit}
          block
          square
          style={[globalStyles.boton, {marginTop: 30}]}>
          <Text style={globalStyles.botonTexto}>Crear Proyecto</Text>
        </Button>
      </View>
      {mensaje && monstrarLaerta()}
    </Container>
  );
};

export default NuevoProyecto;
