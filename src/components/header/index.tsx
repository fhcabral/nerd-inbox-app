import Foundation from "@expo/vector-icons/Foundation";
import { View } from 'react-native';
import Text from '../text';
import { useTheme } from '../theme/useTheme';
import styles from './styles';

export default function Header() {
    const { layout, colors } = useTheme();

    return (
        <View style={[styles.container, { marginBottom: layout.space[5] }]}>
            <Text variant="heading">Resumo</Text>
            <View 
                onTouchStart={() => alert('broxa')} 
                style={styles.filterContainer}
            >
                <Text variant="mono" style={styles.filterText}>Filtrar</Text>
                <Foundation name="filter" size={28} color={colors.primary} />
            </View>
        </View>
    );
}