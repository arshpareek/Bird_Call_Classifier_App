import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";



type Props = PropsWithChildren<{
    isVisible: boolean;
    onClose: () => void;
  }>;

export default function ResultModal({isVisible, children, onClose}: Props) {
    return (
        <View>
            <Modal animationType="slide" transparent={true} visible={isVisible}>
                <View style={styles.modalContent}>
                    <Pressable onPress={onClose}>
                        <MaterialIcons name="close" color="#fff" size={22} />
                    </Pressable>
                    <View style={styles.resultContainer}>
                        {children}
                    </View>
                    
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContent: {
      height: '75%',
      width: '100%',
      padding: 20,
      backgroundColor: 'grey',
      borderTopRightRadius: 18,
      borderTopLeftRadius: 18,
      position: 'absolute',
      bottom: 0,
    },
    titleContainer: {
      height: '16%',
      backgroundColor: '#464C55',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      color: '#fff',
      fontSize: 16,
    },
    resultContainer: {
        height: '16%',
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      paddingHorizontal: 20,
      paddingVertical: 20,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });