import React from 'react';
import {StyleSheet, FlatList, View} from 'react-native';
import {
  Container,
  Button,
  Text,
  H2,
  List,
  ListItem,
  Left,
  Right,
  Content,
} from 'native-base';
import globalStyles from '../styles/global';
import {useNavigation} from '@react-navigation/native';

import {gql, useQuery} from '@apollo/client';
const OBTENER_PROYECTOS = gql`
  query obtenerProyectos {
    obtenerProyectos {
      id
      nombre
    }
  }
`;
const Proyectos = () => {
  const navigation = useNavigation();

  const {data, loading, error} = useQuery(OBTENER_PROYECTOS);
  if (loading) return <Text>Cargando....</Text>;
  return (
    <>
      <Container
        style={[globalStyles.contenedor, {backgroundColor: '#e84347'}]}>
        <Button
          onPress={() => navigation.navigate('NuevoProyecto')}
          block
          square
          style={[globalStyles.boton, {marginTop: 30}]}>
          <Text style={globalStyles.botonTexto}>Nuevo Proyecto</Text>
        </Button>
        <H2 style={globalStyles.subtitulo}>Selecciona un Proyecto</H2>
        <View>
          <List style={styles.contenido}>
            {data.obtenerProyectos.map((item) => (
              <ListItem
                onPress={() => navigation.navigate('Proyecto',item)}
                key={item.id}>
                <Left>
                  <Text> {item.nombre}</Text>
                </Left>
                <Right></Right>
              </ListItem>
            ))}
          </List>
        </View>
      </Container>
    </>
  );
};
const styles = StyleSheet.create({
  contenido: {
    backgroundColor: '#fff',
    marginHorizontal: '2.5%',
  },
});

export default Proyectos;
