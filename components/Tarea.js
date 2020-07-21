import React from 'react';
import {StyleSheet, Alert} from 'react-native';

import {Text, ListItem, Left, Right, Icon} from 'native-base';

import {gql, useMutation} from '@apollo/client';

const ACTUALIZAR_TAREA = gql`
  mutation actualizarTarea($id: ID!, $input: TareaInput, $estado: Boolean) {
    actualizarTarea(id: $id, input: $input, estado: $estado) {
      estado
      nombre
      id
    }
  }
`;
const ELIMINAR_TAREA = gql`
  mutation eliminarTarea($id: ID!) {
    eliminarTarea(id: $id)
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
const Tarea = ({tarea, proyectoId}) => {
  const [actualizarTarea] = useMutation(ACTUALIZAR_TAREA);
  const [eliminarTarea] = useMutation(ELIMINAR_TAREA, {
    update(cache) {
      const {obtenerTareas} = cache.readQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: proyectoId,
          },
        },
      });
      cache.writeQuery({
        query: OBTENER_TAREAS,
        variables: {
          input: {
            proyecto: proyectoId,
          },
        },
        data: {
          obtenerTareas: obtenerTareas.filter((item) => item.id !== tarea.id),
        },
      });
    },
  });

  const cambiarEstado = async () => {
    try {
      const {data} = await actualizarTarea({
        variables: {
          id: tarea.id,
          estado: !tarea.estado,
          input: {
            nombre: tarea.nombre,
          },
        },
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarTareaDB = async () => {
    const {id} = tarea;
    try {
      const {data} = await eliminarTarea({
        variables: {
          id,
        },
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const monstrarEliminar = () => {
    Alert.alert('Eliminar Tarea', '¿Deseas eliminar esta tarea?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Confirmar',
        onPress: () => eliminarTareaDB(),
      },
    ]);
  };

  return (
    <>
      <ListItem onLongPress={monstrarEliminar} onPress={cambiarEstado}>
        <Left>
          <Text>{tarea.nombre}</Text>
        </Left>
        <Right>
          <Icon
            style={[
              styles.icono,
              tarea.estado ? styles.completo : styles.incompleto,
            ]}
            name="ios-checkmark-circle"
          />
        </Right>
      </ListItem>
    </>
  );
};

const styles = StyleSheet.create({
  icono: {
    fontSize: 32,
  },
  completo: {
    color: 'green',
  },
  incompleto: {
    color: '#e1e1e1',
  },
});

export default Tarea;
