import { View } from 'react-native';
import { useTheme } from '../../contexts/theme/useTheme';
import Text from '../text';

interface HeaderProps {
  title: string;
  footer: string
}

export default function Header({title, footer}: HeaderProps) {
    const { layout, colors } = useTheme();

    return (
      <View style={{ marginBottom: layout.space[4] }}>
        <Text variant="heading">{title}</Text>
        <Text variant="caption" style={{ color: colors.textMuted, marginTop: layout.space[1] }}>
          {footer}
        </Text>
      </View>
    );
}