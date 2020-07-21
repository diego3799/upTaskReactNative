import React, {useState} from 'react';
import {
  Text,
  Container,
  Button,
  H2,
  Content,
  List,
  Form,
  Item,
  Input,
  Toast,
  View,
} from 'native-base';
import {StyleSheet} from 'react-native';
import globalStyles from '../styles/global';

import {gql, useMutation, useQuery} from '@apollo/client';
import Tarea from '../components/Tarea';
const NUEVA_TAREA = gql`
  mutation nuevaTarea($input: TareaInput) {
    nuevaTarea(input: $input) {
      nombre
      id
      estado
      proyecto
    }
  }
`;
const OBTENER_TAREAS = gql`
  query obtenerTareas($input: ProyectoIDInput) {
    obtenerTareas(input: $input) {
      nombre
      id
      estado
    }
  }
`;
const Proyecto = ({route}) => {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState(null);

  const [nuevaTarea] = useMutation(NUEVA_TAREA, {
    update(cache, {data:{nuevaTarea}}) {
      const {obtenerTareas} = cache.readQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: route.params.id,
          },
        },
      });
      cache.writeQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: route.params.id,
          },
        },
        data: {
          obtenerTareas: [...obtenerTareas, nuevaTarea],
        },
      });
    },
  });
  const {data, loading, error} = useQuery(OBTENER_TAREAS, {
    variables: {
      input: {
        proyecto: route.params.id,
      },
    },
  });
  const handleSubmit = async () => {
    if (nombre === '') return setMensaje('Nombre del proyecto obligatorio');
    try {
      const {data} = await nuevaTarea({
        variables: {
          input: {
            nombre,
            proyecto: route.params.id,
          },
        },
      });
      setNombre('');
      setMensaje('Proyecto Agregado correctamente');
    } catch (error) {
      console.log(error);
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
  if(loading) return <Text>Cargando....</Text>
  return (
    <Container style={[globalStyles.contenedor, {backgroundColor: '#e84347'}]}>
      <Form style={{marginHorizontal: '2.5%', marginTop: 20}}>
        <Item inlineLabel last style={globalStyles.input}>
          <Input
            value={nombre}
            onChangeText={(e) => setNombre(e)}
            placeholder="Nombre de la Tarea"
          />
        </Item>
        <Button onPress={handleSubmit} style={globalStyles.boton} block square>
          <Text style={globalStyles.botonTexto}>Crear tarea</Text>
        </Button>
      </Form>
      <H2 style={globalStyles.subtitulo}>Tareas: {route.params.nombre}</H2>
      <View>
        <List style={styles.contenido}>
          {data.obtenerTareas.map((tarea) => (
            <Tarea key={tarea.id} proyectoId={route.params.id} tarea={tarea} />
          ))}
        </List>
      </View>
      {mensaje && monstrarLaerta()}
    </Container>
  );
};

const styles = StyleSheet.create({
  contenido: {
    backgroundColor: '#fff',
    marginHorizontal: '2.5%',
  },
});

export default Proyecto;
