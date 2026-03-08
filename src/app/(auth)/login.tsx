import Button from '@/src/components/button';
import { Screen } from '@/src/components/screen';
import Text from '@/src/components/text';
import TextInputComponent from '@/src/components/textInput';
import { useTheme } from '@/src/contexts/theme/useTheme';
import Entypo from '@expo/vector-icons/Entypo';
import { Image, View } from 'react-native';
import useLoginModel from './login.model';
import styles from './styles';

export default function Auth() {
  const { colors } = useTheme();
  const { email, setEmail, password, setPassword, handleLogin } = useLoginModel();

  return (
      <Screen>
        <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('@/src/assets/images/nerdLogo.png')}
            style={styles.logo}
          />

          <Text variant="heading">Bem-Vindo, Nerd!</Text>
        </View>

        <View style={styles.form}>
          <TextInputComponent
            label="Email"
            placeholder="Digite o Email..."
            onChangeText={setEmail}
            value={email}
          />

          <TextInputComponent
            label="Senha"
            placeholder="Digite a Senha..."
            onChangeText={setPassword}
            value={password}
          />

          <Button
            title="Login"
            icon={<Entypo name="login" size={16} color={colors.text} />}
            variant="primary"
            disabled={false}
            onPress={handleLogin}
            style={styles.button}
          />
        </View>
      </View>
      </Screen>
  );
}